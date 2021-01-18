using System;
using System.Collections.Generic;
// 추가 
using System.IO;
using System.Linq;
using System.Text;
using HiQInGamePlayLogic;

namespace COMMON_UTLL_FUNC
{
    class Common
    {
        public static string PATH = System.Environment.CurrentDirectory + "/csv/";
        // csv 파일 리스트 
        public static List<string> csvList = new List<string>();

        public static string GetCaller([System.Runtime.CompilerServices.CallerMemberName] string memberName = "")
        {
            return memberName;
        }

        // csv 파일 리스트 
        public static void CsvLoader()
        {
            /*
            DirectoryInfo CsvFileList = new DirectoryInfo(PATH);
            foreach (var csv in CsvFileList.GetFiles())
            {
                Console.WriteLine(csv.Name);
                csvList.Add(csv.Name);
            }*/

        }
        // csv 내용 읽어오기
        public static void CsvData()
        {

            CTableManagerS.Instance.LoadServerTablesFromFiles(PATH);
            var t = HiQInGamePlayLogic.CTableManagerS.Instance.ActionBlockTable;
            if(t != null)
            {
                if( t.GetRowList().Count > 0 )
                    Console.WriteLine("Mtach [FileData] Load Succ...........");
                else
                    Console.WriteLine("Mtach [FileData] Load Faild...........");
            }
            else
            {
                 Console.WriteLine("Mtach [FileData] Load Faild...........");
            }

            /*
            foreach (var name in csvList)
            {
                using (FileStream fs = new FileStream(PATH + name, FileMode.Open , FileAccess.Read, FileShare.ReadWrite))
                {
                    using (StreamReader sr = new StreamReader(fs, Encoding.UTF8, false))
                    {
                        string data = sr.ReadToEnd();
                        // 혹시 모를 확장자 대소문자를 위해 확장자 제거
                        string[] names = name.Split('.');

                        switch (names[0])
                        {
                            case "ActionTable_Block":
                                {
                                    CTableManagerS.Instance.ActionBlockTable.Load(data);
                                    CTableManagerS.Instance.ActionBlockTable.Build();
                                    Console.WriteLine("ActionTable_Block = {0}", CTableManagerS.Instance.ActionBlockTable.NumRows());
                                }
                                break;
                            case "ActionTable_Receive":
                                {
                                    CTableManagerS.Instance.ActionReceiveTable.Load(data);
                                    CTableManagerS.Instance.ActionReceiveTable.Build();
                                    Console.WriteLine("ActionTable_Receive = {0}", CTableManagerS.Instance.ActionReceiveTable.NumRows());
                                }
                                break;
                            case "ActionTable_Serve":
                                {
                                    CTableManagerS.Instance.ActionServeTable.Load(data);
                                    CTableManagerS.Instance.ActionServeTable.Build();
                                    Console.WriteLine("ActionTable_Serve = {0}", CTableManagerS.Instance.ActionServeTable.NumRows());
                                }
                                break;
                            case "ActionTable_Spike":
                                {
                                    CTableManagerS.Instance.ActionSpikeTable.Load(data);
                                    CTableManagerS.Instance.ActionSpikeTable.Build();
                                    Console.WriteLine("ActionTable_Spike = {0}", CTableManagerS.Instance.ActionSpikeTable.NumRows());
                                }
                                break;
                            case "ActionTable_Toss":
                                {
                                    CTableManagerS.Instance.ActionTossTable.Load(data);
                                    CTableManagerS.Instance.ActionTossTable.Build();
                                    Console.WriteLine("ActionTable_Toss = {0}", CTableManagerS.Instance.ActionTossTable.NumRows());
                                }
                                break;
                            case "Area_Table_Situation":
                                {
                                    CTableManagerS.Instance.AreaSituationTable.Load(data);
                                    CTableManagerS.Instance.AreaSituationTable.Build();
                                    Console.WriteLine("Area_Table_Situation = {0}", CTableManagerS.Instance.AreaSituationTable.NumRows());
                                }
                                break;
                            case "BalanceTable_PlayValue":
                                {
                                    CTableManagerS.Instance.BalancePlayValueTable.Load(data);
                                    CTableManagerS.Instance.BalancePlayValueTable.Build();
                                    Console.WriteLine("BalanceTable_PlayValue = {0}", CTableManagerS.Instance.BalancePlayValueTable.NumRows());
                                }
                                break;
                            case "Character_Card":
                                {
                                    CTableManagerS.Instance.CharacterCardTableV2.Load(data);
                                    CTableManagerS.Instance.CharacterCardTableV2.Build();
                                    Console.WriteLine("Character_Card = {0}", CTableManagerS.Instance.CharacterCardTableV2.NumRows());
                                }
                                break;

                            case "Character_unique":
                                {
                                    CTableManagerS.Instance.CharacterUniqueTableV2.Load(data);
                                    CTableManagerS.Instance.CharacterUniqueTableV2.Build();
                                    Console.WriteLine("Character_unique = {0}", CTableManagerS.Instance.CharacterUniqueTableV2.NumRows());
                                }
                                break;
                            case "BalanceLevelup":
                                {
                                    CTableManagerS.Instance.BalanceLevelupTableV2.Load(data);
                                    CTableManagerS.Instance.BalanceLevelupTableV2.Build();
                                    Console.WriteLine("BalanceLevelup = {0}", CTableManagerS.Instance.BalanceLevelupTableV2.NumRows());
                                }
                                break;
                            case "FunctionTable":
                                {
                                    CTableManagerS.Instance.FurnitureTableEx.Load(data);
                                    CTableManagerS.Instance.FurnitureTableEx.Build();
                                    Console.WriteLine("FunctionTable = {0}", CTableManagerS.Instance.FurnitureTableEx.NumRows());
                                }
                                break;
                            case "Itemtable_Focustrain":
                                {
                                    CTableManagerS.Instance.ItemtableFocustrainTable.Load(data);
                                    CTableManagerS.Instance.ItemtableFocustrainTable.Build();
                                    Console.WriteLine("Itemtable_Focustrain = {0}", CTableManagerS.Instance.ItemtableFocustrainTable.NumRows());
                                }
                                break;
                            case "SchoolTable":
                                {
                                    CTableManagerS.Instance.SchoolTable.Load(data);
                                    CTableManagerS.Instance.SchoolTable.Build();
                                    Console.WriteLine("SchoolTable = {0}", CTableManagerS.Instance.SchoolTable.NumRows());
                                }
                                break;
                            case "SkillTable_Active":
                                {
                                    CTableManagerS.Instance.ActiveSkillTable.Load(data);
                                    CTableManagerS.Instance.ActiveSkillTable.Build();
                                    Console.WriteLine("SkillTable_Active = {0}", CTableManagerS.Instance.ActiveSkillTable.NumRows());
                                }
                                break;
                            case "SkillTable_GroupBuff":
                                {
                                    CTableManagerS.Instance.SkillGroupBuffTableV2.Load(data);
                                    CTableManagerS.Instance.SkillGroupBuffTableV2.Build();
                                    Console.WriteLine("SkillTable_GroupBuff = {0}", CTableManagerS.Instance.SkillGroupBuffTableV2.NumRows());
                                }
                                break;
                            case "TeamTable":
                                {
                                    CTableManagerS.Instance.TeamTableV2.Load(data);
                                    CTableManagerS.Instance.TeamTableV2.Build();
                                    Console.WriteLine("TeamTable = {0}", CTableManagerS.Instance.TeamTableV2.NumRows());
                                }
                                break;
                            case "ValueTable":
                                {
                                    CTableManagerS.Instance.ValueTable.Load(data);
                                    CTableManagerS.Instance.ValueTable.Build();
                                    Console.WriteLine("ValueTable = {0}", CTableManagerS.Instance.ValueTable.NumRows());
                                }
                                break;
                            default: 
                                {
                                }break;
                        }
                    }
                }
            }
            Console.WriteLine("Csv Loader End");
            */
        }
    }
}
