

using System.Configuration;

namespace APP_CONFIGURATION
{

    public class AppConfiguration
    {

        private static bool _LOG4_ABLE_DEFAULT = false;
        private static bool _LOG4_ABLE_INPUT   = false;
        private static bool _LOG4_ABLE_OUTPUT  = false;

        public static bool LOG4_ABLE_DEFAULT { get { return _LOG4_ABLE_DEFAULT; } set { _LOG4_ABLE_DEFAULT = value; } }
        public static bool LOG4_ABLE_INPUT   { get { return _LOG4_ABLE_INPUT; } set { _LOG4_ABLE_INPUT = value; } }
        public static bool LOG4_ABLE_OUTPUT { get { return _LOG4_ABLE_OUTPUT; } set { _LOG4_ABLE_OUTPUT = value; } }

        public static bool LOG_DEFAULT_ABLE()    {
            if (GetAppConfig("LOG4_ABLE_DEFAULT") != "0") return true; return false;
        }
        public static bool LOG_INPUT_ABLE()      {
            if (GetAppConfig("LOG4_ABLE_INPUT") != "0") return true; return false;
        }
        public static bool LOG_OUTPUT_ABLE()    {
            if (GetAppConfig("LOG4_ABLE_OUTPUT") != "0") return true; return false;
        }



        public static string GetAppConfig(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }

        public static void SetAppConfig(string key, string value)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            KeyValueConfigurationCollection cfgCollection = config.AppSettings.Settings;

            cfgCollection.Remove(key);
            cfgCollection.Add(key, value);

            config.Save(ConfigurationSaveMode.Modified);
            ConfigurationManager.RefreshSection(config.AppSettings.SectionInformation.Name);
        }

        public static void AddAppConfig(string key, string value)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            KeyValueConfigurationCollection cfgCollection = config.AppSettings.Settings;
            cfgCollection.Add(key, value); config.Save(ConfigurationSaveMode.Modified);
            ConfigurationManager.RefreshSection(config.AppSettings.SectionInformation.Name);
        }
        public static void RemoveAppConfig(string key)
        {
            Configuration config = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
            KeyValueConfigurationCollection cfgCollection = config.AppSettings.Settings;

            try
            {
                cfgCollection.Remove(key);
                config.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection(config.AppSettings.SectionInformation.Name);
            }
            catch
            {
            }
        }//RemoveAppConfig

    
    }

}