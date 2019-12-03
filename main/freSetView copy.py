from django.shortcuts import render
from django.http import JsonResponse
from main import staticData
import numpy as np
import json
def getFreSetViewData(request):
    res  = []
    if request.is_ajax():
        temp = request.POST.get("key")
        freSet = eval(json.loads(temp))
        freSets = staticData.get_value("freSet")
        resFreSet = None
        for freItem in freSets:
            comparaSet = freItem[0]
            # print(comparaSet)
            if(freSet == comparaSet):
                resFreSet = freItem
                break
        # print(resFreSet)
        src_records = staticData.get_value("src_new_records")
        for freItem in freSet:
            if(freItem[0:2] == "SG"):
                continue
            temp = {}
            temp["WF_name"] = freItem

            total = 0
            for record in src_records.keys():
                # print(record)
                if(freItem in src_records[record]):
                    total += 1
            temp["total"] = total

            recordList = []
            for HPHM in resFreSet[3]:
                record = src_records[HPHM]
                num = record[freItem]["num"]
                recordList.append(num)
            print(len(recordList))
            intervals = divideInterval(recordList)
            index = 1
            for interval in intervals:
                # intervalName = "rank _" + str(interval[0]) + "_" + str(interval[1])
                intervalName = "rank_"+ str(index)
                temp[intervalName] = {}
                temp[intervalName]["interval"] = interval
                temp[intervalName]["num"] = 0
                index += 1

            for record in recordList:
                index = 1
                for interval in intervals:
                    if( record>= interval[0] and record<= interval[1]):
                        # intervalName = "rank _" + str(interval[0]) + "_" + str(interval[1])
                        intervalName = "rank_"+ str(index)
                        temp[intervalName]["num"] += 1
                        break
                    index += 1
            res.append(temp)
    print(res)
    sendData = {}
    sendData["freSetData"] = res
    return JsonResponse(sendData)
# 根据原始记录和索引 获取次数列表
def getNumList(records, indexs):
    res = []
    for key in indexs:
        record = src_records[key]
        num = record[freItem]["num"]
        res.append(num)
    return res
def divideInterval(record):
    recordMax = max(record)
    recordMin = min(record)
    num = 4
    res = []
    step = int((recordMax - recordMin + 1) / num)
    for i in range(recordMin,(recordMin+step*num)-1,step):
        postNum = i+step-1
        if(recordMax - postNum < step):
            postNum = recordMax
        temp = (i, postNum)
        res.append(temp)
    return res
# def divideInterval(record):
#     length = len(record)
#     record.sort()
#     # print(record)
#     num = 4
#     step = int(length / num)
#     print(step)
#     res = []
#     pre = length-1
#     index = length-1
#     for i in range(length-1,0,step*-1):
#         num = record[i-step]
#         index = i-step
#         if(pre < i-step or i-step<0):
#             continue
#         print("pre:",pre)
#         res.append((record[i-step], record[pre]))
#         while(record[index] == num):
#             index -= 1
#             pre = index

#         # print(record[i],record[i-step])
#         # print(i,i-step)
#         # if(record[i] == pre):
#         #     break
#         # pre = record[i-step]
#         # res.append((record[i-step],record[i]))
#     return res
