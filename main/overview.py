from django.shortcuts import render
from django.http import JsonResponse
from main import staticData
import numpy as np
from sklearn.manifold import MDS
import json
from functools import cmp_to_key
import copy
from main import computeFreSet
from main import regularTwoSet
from main import recomputeSet
#计算支持集重合度
def countSup(a,b):
    set1=set(a[3])
    set2=set(b[3])
    set3=set1&set2
    set4=set1|set2
    m=len(set3)
    n=len(set4)
    d=(n-m)/n
    return d

#计算属性重合度
def countAttr(a,b):
    set1=a[0]&b[0]
    set2=a[0]|b[0]
    m = len(set1)
    n = len(set2)
    d=(n-m)/n
    return d

#根据频繁集计算距离矩阵
def getMatrix(freSet):
    num = len(freSet)
    i = 0
    matrix = np.zeros((num, num))
    for index in range(num):
        # print(index)
        for index1 in range(index, num):
            distance = countSup(freSet[index],freSet[index1])
            matrix[index][index1] = distance
    for index in range(1,num):
        for index1 in range(0, index):
            matrix[index][index1] = matrix[index1][index]
    return matrix

def getMDSRes(matrix):
    clf2=MDS(2,dissimilarity='precomputed')
    clf2.fit(matrix)
    c_t1=clf2.fit_transform(matrix)
    return c_t1


def getOverviewData(request):
    if request.is_ajax():
        temp = request.POST.get("key")
        data = json.loads(temp)
        if(len(data) != 0):
            grain = getNewFreSet(data)
            print("grain:",grain)
            src_records = staticData.get_value("src_records")
            src_new_records = computeFreSet.getSrcRecordsNew(src_records, grain)
            # print("src_new_records", src_new_records)
            freSet = computeFreSet.getFreSet(src_new_records)
            staticData.set_value("src_new_records", src_new_records)
            staticData.set_value("freSet", freSet)
    freSet = staticData.get_value("freSet")
    # for record in freSet:
        # print(freSet[0],freSet[1],freSet[2])
    # print("freSet:",freSet)
    print("here is overview!!!!")
    matrix = getMatrix(freSet)
    print("matrix is computed!")
    res_MDS = getMDSRes(matrix)
    print("coor is computed!")
    # # np.save('.\\static\\data\\resMDS.npy', res_MDS)
    # res_MDS = np.load(".\\static\\data\\resMDS.npy",allow_pickle=True).tolist()
    print("here is over!!!!")
    res = []
    index = 0
    for freItem in freSet:
        temp = {}
        temp["freSet"] = str(freItem[0])
        temp["support"] = freItem[1]
        temp["confid"] = freItem[2]
        temp["MDS"] = res_MDS[index]
        res.append(temp)
        index += 1
    sendData = {}
    sendData["overviewData"] = res
    return JsonResponse(sendData, encoder = staticData.NpEncoder)

def getNewFreSet(data):
    grain = staticData.get_value("grain")
    num_dis = staticData.get_value("num_dis")
    # print("1344A grain is ", grain["1344A"])
    print(data)
    diff_WF_intervals = {}
    for record in data:
        freSet = eval(str(record["freSet"]))
        items = eval(str(record["items"]))
        for item in items:
            if item[0] not in diff_WF_intervals:
                diff_WF_intervals[item[0]] = []
            diff_WF_intervals[item[0]].append(item[1])
    for key in diff_WF_intervals.keys():
        # list_interval = getMaxSet(diff_WF_intervals[key])
        WF_key = key
        if (key[0:2]!="SG"):
            tempKey = key.split("_")
            if(len(tempKey) > 1):
                WF_key = tempKey[0]
        # 先将以往的也扔进去
        for the_grain in grain[WF_key]:
            # grain[WF_key].append((list_interval[index],list_interval[index+1]))
            diff_WF_intervals[key].append(the_grain)
        the_num_dis = num_dis[WF_key]
        res_recom = recomputeSet.recomputeSet(diff_WF_intervals[key], the_num_dis, 0.05)
        list_interval = res_recom.inter_res
        # list_interval = recomputeSet(diff_WF_intervals[key], WF_key)
        grain[WF_key] = []
        print("整合后的结果：", list_interval)
        for index in range(0, len(list_interval),2):
            grain[WF_key].append((list_interval[index],list_interval[index+1]))
    staticData.set_value("grain", grain)    
    return grain
    # print(res)
    # print("重合度较大的集合",getMaxSet(res))


# # def recomputeGrain(grain):
# #     for key in grain.keys():
# #         record = grain[key]
# #         record.sort(key=cmp_to_key(cmp1))
# # 当前对区间整合算法做了以下改进，
# # 两区间的整合结果还是两区间
# # 区间列表的整合优先级按照两区间重叠部分的数据量来做
# def recomputeSet(src_intervals, WF_name):
#     num_dis = staticData.get_value("num_dis")
#     the_num_dis = num_dis[WF_name]
#     src_sets_list = turnInter2Set(src_intervals)
#     now_sets_list = copy.deepcopy(src_sets_list)
#     print("the num list:", the_num_dis)
#     print("now set list", now_sets_list)
#     while(True):
#         maxInter = getInterEvalue(now_sets_list, the_num_dis)
#         if(maxInter[2] == 0):
#             break
#         now_sets_list.remove(maxInter[0])
#         now_sets_list.remove(maxInter[1])
#         regular = regularTwoSet.regularTwoSet(the_num_dis, maxInter[0], maxInter[1])
#         new_set1, new_set2 = regular.compute()
#         now_sets_list.append(new_set1)
#         now_sets_list.append(new_set2)
#         print("now set list", now_sets_list)

#     res = turnSet2Inter(now_sets_list)
#     return res

# # 对一个集合列表进行统计其每两个集合的指标
# def getInterEvalue(now_sets, the_num_dis):
#     res = (set(),set(),0)
#     max = 0
#     for index in range(len(now_sets)):
#         for index1 in range(index+1, len(now_sets)):
#             temp = getEvalue2sets(now_sets[index],now_sets[index1],the_num_dis)
#             if(temp[2] > max):
#                 res = temp
#                 max = temp[2]
#     return res
# # 对两个集合计算其指标
# def getEvalue2sets(set1, set2, the_num_dis):
#     set_AND = set1 & set2
#     num = 0
#     for record in set_AND:
#         if(str(record) in the_num_dis):
#             num += the_num_dis[str(record)]
#     return (set1, set2, num)
# # 因为转化为集合方便计算， 所以先将区间转为集合 再将集合转为区间
# def turnInter2Set(intervals):
#     res = []
#     for inter in intervals:
#         temp = set()
#         for i in range(inter[0],inter[1]+1):
#             temp.add(i)
#         res.append(temp)
#     return res
# def turnSet2Inter(set_list):
#     res = []
#     for set1 in set_list:
#         if(len(set1) != 0):
#             min_set = min(set1)
#             max_set = max(set1)
#             res.append(min_set)
#             res.append(max_set)
#     return res
# # 以前的方法是直接计算重合度最大的那个区间将该区间放入粒度中去
# def getMaxSet(src):
#     src.sort(key=cmp_to_key(cmp1))
#     mapOfEndPoint = {}
#     index = 0
#     setEndPoint = set()
#     for record in src:
#         setEndPoint.add(record[0])
#         setEndPoint.add(record[1])
#     setEndPoint = list(setEndPoint)
#     setEndPoint.sort()
#     mapOfEndPoint = {}
#     index = 0
#     for record in setEndPoint:
#         mapOfEndPoint[record] = index
#         index += 1
#     temp = np.zeros(len(mapOfEndPoint.keys())+1)
#     for record in src:
#         temp[mapOfEndPoint[record[0]]] += 1
#         temp[mapOfEndPoint[record[1]]+1] -= 1
#     index = 1
#     for index in range(1,len(temp)-1):
#         temp[index]+=temp[index-1]
#     maxNum = np.max(temp)
#     isStartPoint = True
#     pre = -1
#     res = []
#     index = 0
#     for record in temp:
#         if(record == maxNum):
#             temp1 = -1
#             for temp2 in mapOfEndPoint.keys():
#                 if(mapOfEndPoint[temp2] == index):
#                     temp1 = temp2
#                     break
#             if(isStartPoint):
#                 res.append(temp1)
#                 isStartPoint = False
#             pre = temp1   
#         else:
#             if(not isStartPoint):
#                 res.append(pre)
#                 isStartPoint = True
#         index += 1
#     return res
# def cmp1(a, b):
#     return a[0]-b[0]
# def regularTwoSet(interval1, interval2):
#     # 先求出交集与差集
#     set_AND = set()
#     set_SUB1 = set()
#     set_SUB2 = set()
#     for i in range(interval1[0],interval1[1]+1):
#         if(i<= interval2[0] and i>= interval2[1]):
#             set_AND.add(i)
#         set_SUB1.add(i)
#     for i in range(interval2[0],interval2[1]+1):
#         set_SUB2.add(i)
#     set_SUB1 = set_SUB1 - set_AND
#     set_SUB2 = set_SUB2 - set_AND
#     # 为了匹配包含关系 这里需要对包含关系做一些处理
#     if len(set_SUB1) == 0 or len(set_SUB2) == 0:
#         length1 = interval1[1] - interval1[0]
#         length2 = interval2[1] - interval2[0]
#         if(length1>length2):
#             set_SUB1, set_SUB2 = getNewSubSet(set_AND, interval1)
#         else:            
#             set_SUB1, set_SUB2 = getNewSubSet(set_AND, interval2)
#     # 得到那三个集合后，对这三个集合合并为两个集合并返回两个区间
#     resInter1, resInter2 = mergeInterval(set_AND,set_SUB1,set_SUB2)
#     return