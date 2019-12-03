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
            # 首先获取某违法的全部次数的列表 以及频繁集中的次数的列表
            overallNumList = getNumList(src_records, src_records.keys(), freItem)
            freSetNumList = getNumList(src_records, resFreSet[3], freItem)
            # 再对频繁集中的列表求出区间的列表
            intervals = divideInterval(freSetNumList)
            # 再根据区间的列表和次数的列表 对数量进行整理
            temp["overallNum"] = len(overallNumList)
            temp["freSetNum"] = len(freSetNumList)
            temp["overall"] = {}
            getIntervalNum(overallNumList, intervals, temp["overall"])
            temp["freSet"] = {}
            getIntervalNum(freSetNumList, intervals, temp["freSet"])
            res.append(temp)
    print("区间：",res)
    sendData = {}
    sendData["freSetData"] = res
    return JsonResponse(sendData)

# 根据原始记录和索引以及当前的违法行为 获取次数列表
def getNumList(records, indexs, freItem):
    res = []
    for key in indexs:
        record = records[key]
        if(freItem in record):
            num = record[freItem]["num"]
            res.append(num)
    return res

def getIntervalNum(numList, intervals, temp):
    index = 1
    for interval in intervals:
        intervalName = "rank_"+ str(index)
        temp[intervalName] = {}
        temp[intervalName]["interval"] = interval
        temp[intervalName]["num"] = 0
        index += 1
    for record in numList:
        index = 1
        for interval in intervals:
            if( record>= interval[0] and record<= interval[1]):
                intervalName = "rank_"+ str(index)
                temp[intervalName]["num"] += 1
                break
            index += 1

def divideInterval(record):
    recordMax = max(record)
    recordMin = min(record)
    print("record min and max:",recordMin,recordMax)
    num = 4
    res = []
    index = 1
    step = int((recordMax - recordMin + 1) / num)
    if(step<1):
        step = 1
    for i in range(recordMin,(recordMin+step*num),step):
        # print("index:",i)
        postNum = i+step-1
        if(index == num):
            postNum = recordMax    
        index += 1
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
