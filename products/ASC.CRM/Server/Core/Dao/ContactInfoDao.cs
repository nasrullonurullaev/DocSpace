/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/

using System;
using System.Collections.Generic;
using System.Linq;

using ASC.Collections;
using ASC.Common;
using ASC.Common.Caching;
using ASC.Common.Logging;
using ASC.Core;
using ASC.Core.Common.EF;
using ASC.Core.Tenants;
using ASC.CRM.Core.EF;
using ASC.CRM.Core.Entities;
using ASC.CRM.Core.Enums;
using ASC.Web.CRM.Core.Search;

using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace ASC.CRM.Core.Dao
{
    [Scope]
    public class ContactInfoDao : AbstractDao
    {
        public ContactInfoDao(
             DbContextManager<CrmDbContext> dbContextManager,
             TenantManager tenantManager,
             SecurityContext securityContext,
             TenantUtil tenantUtil,
             IOptionsMonitor<ILog> logger,
             ICache ascCache,
             FactoryIndexerContactInfo factoryIndexerContactInfo,
             IServiceProvider serviceProvider,
             IMapper mapper)
           : base(dbContextManager,
                 tenantManager,
                 securityContext,
                 logger,
                 ascCache, 
                 mapper)
        {
            TenantUtil = tenantUtil;
            ServiceProvider = serviceProvider;

            FactoryIndexerContactInfo = factoryIndexerContactInfo;
        }

        public IServiceProvider ServiceProvider { get; }
        public TenantUtil TenantUtil { get; }
        public FactoryIndexerContactInfo FactoryIndexerContactInfo { get; }

        public ContactInfo GetByID(int id)
        {
            var dbContactInfo = CrmDbContext.ContactsInfo.SingleOrDefault(x => x.Id == id);

            return _mapper.Map<ContactInfo>(dbContactInfo);
        }

        public void Delete(int id)
        {
            var itemToDelete = new DbContactInfo
            {
                Id = id
            };

            CrmDbContext.ContactsInfo.Remove(itemToDelete);
            CrmDbContext.SaveChanges();

            FactoryIndexerContactInfo.Delete(r => r.Where(a => a.Id, id));
        }

        public void DeleteByContact(int contactID)
        {
            if (contactID <= 0) return;

            CrmDbContext.RemoveRange(Query(CrmDbContext.ContactsInfo)
                                        .Where(x => x.ContactId == contactID));

            CrmDbContext.SaveChanges();

            FactoryIndexerContactInfo.Delete(r => r.Where(a => a.ContactId, contactID));
        }

        public int Update(ContactInfo contactInfo)
        {
            var result = UpdateInDb(contactInfo);

            FactoryIndexerContactInfo.Update(Query(CrmDbContext.ContactsInfo)
                                        .Where(x => x.ContactId == contactInfo.ID).Single());

            return result;
        }

        private int UpdateInDb(ContactInfo contactInfo)
        {
            if (contactInfo == null || contactInfo.ID == 0 || contactInfo.ContactID == 0)
                throw new ArgumentException();

            var itemToUpdate = new DbContactInfo
            {
                Id = contactInfo.ID,
                Data = contactInfo.Data,
                Category = contactInfo.Category,
                IsPrimary = contactInfo.IsPrimary,
                ContactId = contactInfo.ContactID,
                Type = contactInfo.InfoType,
                LastModifedOn = TenantUtil.DateTimeToUtc(TenantUtil.DateTimeNow()),
                LastModifedBy = _securityContext.CurrentAccount.ID,
                TenantId = TenantID
            };

            CrmDbContext.ContactsInfo.Update(itemToUpdate);

            CrmDbContext.SaveChanges();

            return contactInfo.ID;
        }


        public int Save(ContactInfo contactInfo)
        {
            var id = SaveInDb(contactInfo);

            contactInfo.ID = id;

            var dbContactInfo = Query(CrmDbContext.ContactsInfo)
                                        .Where(x => x.ContactId == contactInfo.ID)
                                        .Single();

            FactoryIndexerContactInfo.Index(dbContactInfo);

            return id;
        }

        private int SaveInDb(ContactInfo contactInfo)
        {
            var itemToInsert = new DbContactInfo
            {
                Data = contactInfo.Data,
                Category = contactInfo.Category,
                IsPrimary = contactInfo.IsPrimary,
                ContactId = contactInfo.ContactID,
                Type = contactInfo.InfoType,
                LastModifedOn = TenantUtil.DateTimeToUtc(TenantUtil.DateTimeNow()),
                LastModifedBy = _securityContext.CurrentAccount.ID,
                TenantId = TenantID

            };

            CrmDbContext.Add(itemToInsert);

            CrmDbContext.SaveChanges();

            return itemToInsert.Id;

        }

        public List<String> GetListData(int contactID, ContactInfoType infoType)
        {
            return GetList(contactID, infoType, null, null).ConvertAll(item => item.Data);
        }

        public List<ContactInfo> GetAll()
        {
            return GetList(0, null, null, null);
        }

        public List<ContactInfo> GetAll(int[] contactID)
        {
            if (contactID == null || contactID.Length == 0) return null;

            var result = Query(CrmDbContext.ContactsInfo)
                .Where(x => contactID.Contains(x.ContactId))
                .ToList();

            return _mapper.Map<List<DbContactInfo>, List<ContactInfo>>(result);
        }

        public List<ContactInfo> GetList(int contactID, ContactInfoType? infoType, int? categoryID, bool? isPrimary)
        {
            var items = Query(CrmDbContext.ContactsInfo);

            if (contactID > 0)
                items = items.Where(x => x.ContactId == contactID);

            if (infoType.HasValue)
                items = items.Where(x => x.Type == infoType.Value);

            if (categoryID.HasValue)
                items = items.Where(x => x.Category == categoryID.Value);

            if (isPrimary.HasValue)
                items = items.Where(x => x.IsPrimary == isPrimary.Value);

            items = items.OrderBy(x => x.Type);

            return _mapper.Map<List<DbContactInfo>, List<ContactInfo>>(items.ToList());
        }


        public int[] UpdateList(List<ContactInfo> items, Contact contact = null)
        {
            if (items == null || items.Count == 0) return null;

            var result = new List<int>();

            var tx = CrmDbContext.Database.BeginTransaction();

            foreach (var contactInfo in items)
                result.Add(UpdateInDb(contactInfo));

            tx.Commit();

            if (contact != null)
            {
                var itemIDs = items.Select(y => y.ID);

                var dbContactInfos = Query(CrmDbContext.ContactsInfo)
                            .Where(x => itemIDs.Contains(x.Id));

                foreach (var dbContactInfo in dbContactInfos)
                {
                    FactoryIndexerContactInfo.Index(dbContactInfo);
                }
            }

            return result.ToArray();
        }

        public int[] SaveList(List<ContactInfo> items, Contact contact = null)
        {
            if (items == null || items.Count == 0) return null;

            var result = new List<int>();

            var tx = CrmDbContext.Database.BeginTransaction();

            foreach (var contactInfo in items)
            {
                var contactInfoId = SaveInDb(contactInfo);
                contactInfo.ID = contactInfoId;
                result.Add(contactInfoId);
            }

            tx.Commit();

            if (contact != null)
            {
                var itemIDs = items.Select(y => y.ID);

                var dbContactInfos = Query(CrmDbContext.ContactsInfo)
                            .Where(x => itemIDs.Contains(x.Id));

                foreach (var dbContactInfo in dbContactInfos)
                {
                    FactoryIndexerContactInfo.Index(dbContactInfo);
                }
            }

            return result.ToArray();
        }
    }
}