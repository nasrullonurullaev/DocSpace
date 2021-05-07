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


#region Import

using System;
using System.Collections.Generic;
using System.Linq;

using ASC.Collections;
using ASC.Common;
using ASC.Common.Caching;
using ASC.Common.Logging;
using ASC.Core;
using ASC.Core.Common.EF;
using ASC.CRM.Core.EF;
using ASC.CRM.Core.Entities;
using ASC.CRM.Resources;

using AutoMapper;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

#endregion

namespace ASC.CRM.Core.Dao
{  
    [Scope]
    public class DealMilestoneDao : AbstractDao
    {

        public DealMilestoneDao(DbContextManager<CrmDbContext> dbContextManager,
                                TenantManager tenantManager,
                                SecurityContext securityContext,
                                IOptionsMonitor<ILog> logger,
                                ICache ascCache,
                                IMapper mapper) :
                                            base(dbContextManager,
                                                    tenantManager,
                                                    securityContext,
                                                    logger,
                                                    ascCache,
                                                    mapper)
        {




        }

        public void Reorder(int[] ids)
        {
            using var tx = CrmDbContext.Database.BeginTransaction();

            for (int index = 0; index < ids.Length; index++)
            {
                var itemToUpdate = Query(CrmDbContext.DealMilestones).FirstOrDefault(x => x.Id == ids[index]);

                itemToUpdate.SortOrder = index;

                CrmDbContext.Update(itemToUpdate);
            }

            CrmDbContext.SaveChanges();

            tx.Commit();
        }

        public int GetCount()
        {
            return Query(CrmDbContext.DealMilestones).Count();
        }


        public Dictionary<int, int> GetRelativeItemsCount()
        {
            return Query(CrmDbContext.DealMilestones)
                    .Join(CrmDbContext.Deals,
                           x => x.Id,
                           x => x.DealMilestoneId,
                           (x, y) => new { x = x, y = y })
                    .GroupBy(x => x.x.Id)
                    .Select(x => new { Id = x.Key, Count = x.Count() })
                    .ToDictionary(x => x.Id, y => y.Count);
        }

        public int GetRelativeItemsCount(int id)
        {
            return Query(CrmDbContext.Deals)
                  .Count(x => x.DealMilestoneId == id);
        }

        public int Create(DealMilestone item)
        {

            if (String.IsNullOrEmpty(item.Title) || String.IsNullOrEmpty(item.Color))
                throw new ArgumentException();

            int id;

            using var tx = CrmDbContext.Database.BeginTransaction();

            if (item.SortOrder == 0)
                item.SortOrder = Query(CrmDbContext.DealMilestones).Select(x => x.SortOrder).Max() + 1;

            var itemToAdd = new DbDealMilestone
            {
                Title = item.Title,
                Description = item.Description,
                Color = item.Color,
                Probability = item.Probability,
                Status = item.Status,
                SortOrder = item.SortOrder,
                TenantId = TenantID
            };

            CrmDbContext.DealMilestones.Add(itemToAdd);
            CrmDbContext.SaveChanges();

            id = itemToAdd.Id;

            tx.Commit();

            return id;
        }

        public void ChangeColor(int id, String newColor)
        {
            var itemToUpdate = new DbDealMilestone
            {
                Id = id,
                Color = newColor,
                TenantId = TenantID
            };

            CrmDbContext.Attach(itemToUpdate);
            CrmDbContext.Entry(itemToUpdate).Property(x => x.Color).IsModified = true;
            CrmDbContext.SaveChanges();
        }

        public void Edit(DealMilestone item)
        {
            if (HaveContactLink(item.ID))
                throw new ArgumentException(String.Format("{0}. {1}.", CRMErrorsResource.BasicCannotBeEdited, CRMErrorsResource.DealMilestoneHasRelatedDeals));

            var itemToUpdate = Query(CrmDbContext.DealMilestones)
                .FirstOrDefault(x => x.Id == item.ID);

            itemToUpdate.Title = item.Title;
            itemToUpdate.Description = item.Description;
            itemToUpdate.Color = item.Color;
            itemToUpdate.Probability = item.Probability;
            itemToUpdate.Status = item.Status;

            CrmDbContext.DealMilestones.Update(itemToUpdate);

            CrmDbContext.SaveChanges();
        }

        public bool HaveContactLink(int dealMilestoneID)
        {
            return Query(CrmDbContext.Deals)
                .Any(x => x.DealMilestoneId == dealMilestoneID);
        }

        public void Delete(int id)
        {
            if (HaveContactLink(id))
                throw new ArgumentException(String.Format("{0}. {1}.", CRMErrorsResource.BasicCannotBeDeleted, CRMErrorsResource.DealMilestoneHasRelatedDeals));

            var dbDealMilestones = new DbDealMilestone
            {
                Id = id,
                TenantId = TenantID
            };

            CrmDbContext.DealMilestones.Remove(dbDealMilestones);

            CrmDbContext.SaveChanges();

        }

        public DealMilestone GetByID(int id)
        {
            var dbDealMilestone = Query(CrmDbContext.DealMilestones).FirstOrDefault(x => x.Id == id);

            return _mapper.Map<DbDealMilestone, DealMilestone>(dbDealMilestone);
        }

        public Boolean IsExist(int id)
        {
            return Query(CrmDbContext.DealMilestones).Any(x => x.Id == id);
        }

        public List<DealMilestone> GetAll(int[] id)
        {
            var result = Query(CrmDbContext.DealMilestones)
                          .OrderBy(x => x.SortOrder)
                          .Where(x => id.Contains(x.Id)).ToList();

            return _mapper.Map<List<DbDealMilestone>, List<DealMilestone>>(result);                
        }

        public List<DealMilestone> GetAll()
        {
            var result =  Query(CrmDbContext.DealMilestones)
                    .OrderBy(x => x.SortOrder)
                    .ToList();

            return _mapper.Map<List<DbDealMilestone>, List<DealMilestone>>(result);

        }
    }
}