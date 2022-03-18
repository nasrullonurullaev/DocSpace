﻿namespace ASC.Web.Api;

public class Startup : BaseStartup
{
    public override bool ConfirmAddScheme { get => true; }

    public Startup(IConfiguration configuration, IHostEnvironment hostEnvironment) : base(configuration, hostEnvironment)
    {

    }

}
