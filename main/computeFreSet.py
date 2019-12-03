from orangecontrib.associate.fpgrowth import *

def getSrcRecordsNew(WF_SG_RES, grain):
    WF_SG_RES_new = {}
    for key in WF_SG_RES.keys():
        record = WF_SG_RES[key]
        record_new = {}
        for key_record in record.keys():
            grain_of_key = grain[key_record]
            num = record[key_record]["num"]
            isInDomain = False
            for num_domain in grain_of_key:
                if(num>=num_domain[0] and num<=num_domain[1]):
                    key_new = key_record + "_" + str(num_domain[0]) + "_" +str(num_domain[1])
                    record_new[key_new] = {}
                    record_new[key_new]["num"] = num
                    isInDomain = True
            if(not isInDomain):
                record_new[key_record] = {}
                record_new[key_record]["num"] = record[key_record]["num"]
        WF_SG_RES_new[key] = record_new
    index = 0
    # for key in WF_SG_RES_new.keys():
    #     if(index == 0):
    #         print(WF_SG_RES_new[key])
    #         index += 1
    return WF_SG_RES_new

def getFreSet(WF_SG_RES_new):
    threshold_sup = 100
    threshold_con = 0.1
    filterSet, fullSet = getFullFilterFreSet(WF_SG_RES_new, threshold_sup)
    print(filterSet)
    print(fullSet)
    print("getfullfreSet")
    freSet_con = addConData(filterSet, fullSet, threshold_con)
    print("addConData")
    freSet = addSrcData(freSet_con, WF_SG_RES_new)
    print("addSrcData")    
    return freSet
# def getFullFilterFreSet(WF_SG_RES_new, threshold_sup):
#     src_data = []
#     for HPHM in WF_SG_RES_new.keys():
#         src_data.append(list(WF_SG_RES_new[HPHM].keys()))
#     itemsets = frequent_itemsets(src_data, threshold_sup)
#     itemsets = list(itemsets)
#     resultItem = []
#     for item in itemsets:
#         sets = set(item[0])
#         num = item[1]
#         flag = False
#         if(len(sets)==1):
#             continue
#         for temp in sets:
#             if(temp[0:2] == "SG"):
#                 if(not flag):
#                     flag = True
#                 else:
#                     flag = False
#                     break
#         if(flag):
#             resultItem.append((sets,num))
#     return resultItem, itemsets
def getFullFilterFreSet(WF_SG_RES_new, threshold_sup):
    src_data = []
    for HPHM in WF_SG_RES_new.keys():
        src_data.append(list(WF_SG_RES_new[HPHM].keys()))
    itemsets = frequent_itemsets(src_data, threshold_sup)
    itemsets = list(itemsets)
    resultItem = []
    for item in itemsets:
        sets = set(item[0])
        num = item[1]
        flag = False
        if(len(sets)==1):
            continue
#         for temp in sets:
#             if(temp[0:2] == "SG"):
#                 if(not flag):
#                     flag = True
#                 else:
#                     flag = False
#                     break
#         if(flag):
        resultItem.append((sets,num))
    return resultItem, itemsets
# def addConData(resultItem, fullFreSet, threshold):
#     index = 0
#     max1 = 0
#     res_conf = []
#     tempItem = groupFreSet(fullFreSet)
#     for record in resultItem:
#         sets = record[0]
#         front = set()
#         for temp in sets:
#             if(not(temp[0:2] == "SG")):
#                 front.add(temp)
#         length = len(sets)-1
#         ans = 0
#         for setItem in tempItem[length-1]:
# #             num1 += 1
#             temp = set(setItem[0])
#             if(len(temp - front) == 0 and (len(front - temp) == 0)):
#                 ans = setItem[1]
#                 break
#         index += 1
#         if((record[1]/ans)>max1):
#             max1 = record[1]/ans
#         res_conf.append((sets,record[1],record[1]/ans))
#     return res_conf
def addConData(resultItem, fullFreSet, threshold):
    index = 0
    max1 = 0
    res_conf = []
    tempItem = groupFreSet(fullFreSet)
    for record in resultItem:
        sets = record[0]
        front = set()
        for temp in sets:
            if(not(temp[0:2] == "SG")):
                front.add(temp)
        length = len(sets)-1
        ans = 0
        try:
            for setItem in tempItem[length-1]:
    #             num1 += 1
                temp = set(setItem[0])
                if(len(temp - front) == 0 and (len(front - temp) == 0)):
                    ans = setItem[1]
                    break
            index += 1
            if((record[1]/ans)>max1):
                max1 = record[1]/ans
        except :
            ans = record[1]
        res_conf.append((sets,record[1],record[1]/ans))
    return res_conf
def groupFreSet(itemsets):
    tempItem = [None] * 13
    for record in itemsets:
        sets = set(record[0])
        num = record[1]
        flag = True
        if(tempItem[len(sets)-1]) == None:
            tempItem[len(sets)-1] = []
        for temp in sets:
            if(temp[0:2] == "SG"):
                flag = False
        if(flag):
            tempItem[len(sets)-1].append((sets,num))
    return tempItem
def addSrcData(freSet, WF_SG_RES_new):
    index = 0
    res_srcData = []
    for record in freSet:
        temp_array = []
        setItems = record[0]
        for each_car in WF_SG_RES_new.keys():
            record_car = WF_SG_RES_new[each_car].keys()
            flag = True
            for item in setItems:
                if(not(item in record_car)):
                    flag = False
            if(flag == True):
                temp_array.append(each_car)
        res_srcData.append((record[0],record[1],record[2],temp_array))
    #     print(index)
        index += 1
        if(len(temp_array)!= record[1]):
            print("error!!!!!!")
    return res_srcData