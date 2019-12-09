from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import HttpResponse
from main import staticData
import numpy as np
# Create your views here.
def init(request):
    WF_SG_RES = np.load('.\\static\\data\\WF_SG_RES_TEST.npy', allow_pickle=True).item()
    freSetRes = np.load(".\\static\\data\\assAnaly_TEST.npy",allow_pickle=True).tolist()
    # WF_SG_RES = np.load('.\\static\\data\\WF_SG_RES.npy', allow_pickle=True).item()
    # freSetRes = np.load(".\\static\\data\\assAnaly.npy",allow_pickle=True).tolist()
    staticData.set_value("src_records",WF_SG_RES)
    staticData.set_value("src_new_records",WF_SG_RES)
    staticData.set_value("freSet",freSetRes)
    num_dis = getWF_NUM_DIS(WF_SG_RES)
    staticData.set_value("num_dis", num_dis)
    # print("freSetRes[0]:",freSetRes[0])
    grain = getGrain(WF_SG_RES)
    staticData.set_value("grain",grain)
    print("load data is over")
    return render(request, "index.html")

def getGrain(src_records):
    grain = {}
    WF_SG_set = set()
    for key in src_records.keys():
        record = src_records[key]
        for key_record in record.keys():
            WF_SG_set.add(key_record)
    for key in WF_SG_set:
        grain[key] = []
    return grain

def getWF_NUM_DIS(records):
    res = {}
    for recordID in records.keys():
        keys = records[recordID].keys()
        for item in keys:
            if(item not in res):
                res[item] = {}
            # print(records[recordID][item])
            # print("wf_name,num",)
            num = records[recordID][item]["num"]
            # print(item,num)
            # if(item == "attr1" and num == 13):
                # print("here is 13!!!!!!!!!!")
            if(str(num) not in res[item]):
                res[item][str(num)] = 0
            res[item][str(num)] += 1
    print("distribute is :",res)
    return res

# def getOverviewData(request):
#     num = 100
#     res = []
#     for i in range(num):
#         temp = {}
#         temp["freSet"] = "test" + str(i)
#         temp["support"] = np.random.randint(1000,5000)
#         temp["confid"] = np.random.rand()
#         temp["MDS"] = (np.random.rand(),np.random.rand())
#         res.append(temp)
#     sendData = {}
#     sendData["overviewData"] = res
#     return JsonResponse(sendData)

# def getFreSetViewData(request):
#     num = 3
#     res = []
#     for i in range(num):
#         temp = {}
#         temp["WF_name"] = "WF"+str(i)
#         temp["total"] = np.random.randint(2000,5000)
#         temp["fre"] = np.random.randint(1000,2000)
#         numRank = 4
#         temp["rank1"] = np.random.randint(0, temp["fre"]/numRank)
#         temp["rank2"] = np.random.randint(0, temp["fre"]/numRank)
#         temp["rank3"] = np.random.randint(0, temp["fre"]/numRank)
#         temp["rank4"] = temp["fre"] - temp["rank1"] - temp["rank2"] - temp["rank3"]
#         res.append(temp)
#     print(res)
#     sendData = {}
#     sendData["freSetData"] = res
#     return JsonResponse(sendData)
