import numpy as np
from functools import cmp_to_key
def cmp2(a,b):
    min1 = min(a[0])
    min2 = min(b[0])
    return min1-min2
class recomputeSet():
    def __init__(self,src_inter_list, num_dis, threshold):
        self.num_dis = num_dis
        self.threshold =threshold
        self.src_inter_list = src_inter_list
        self.set_inter = self.turnInter2Set(src_inter_list)
        self.set_inter = self.getEndPointList(self.set_inter)
        self.set_inter.sort(key=cmp_to_key(cmp2))
        print("不相交的区间为:",self.set_inter)
        self.inter_res = None
        self.getResList()
# 计算端点值及其重合度
    def getEndPointList(self, set_inter):
        while(True):
#             print(self.set_inter)
            set_inter, num = self.findOverlap(set_inter)
            if(num == 0):
                break
        return set_inter
# 找重合的部分，并计算重合度
    def findOverlap(self, now_sets):
        num = 0
        for index in range(len(now_sets)):
            for index1 in range(index+1, len(now_sets)):
                recordAND, recordSUB1, recordSUB2 = self.get3sets(now_sets[index],now_sets[index1])
                if(len(recordAND[0])!=0):
#                     print(now_sets[index],now_sets[index1-1])
                    del now_sets[index]
                    del now_sets[index1-1]
                    now_sets.append(recordAND)
                    if(len(recordSUB1[0]) != 0):
                        now_sets.append(recordSUB1)
                    if(len(recordSUB2[0]) != 0):
                        now_sets.append(recordSUB2)
                    num += 1
                    break
        return now_sets, num
# 根据给定的两个集合 得到新的三集合
    def get3sets(self,record1,record2):
        set1 = record1[0]
        set2 = record2[0]
        num1 = record1[1]
        num2 = record2[1]
        set_AND = set1 & set2
        set_SUB1 = set1 - set_AND
        set_SUB2 = set2 - set_AND
        res_recordAND = (set_AND, num1+num2)
        if(len(set_AND)!=0):
            maxNum = max(set_AND)
            if(len(set_SUB1) == 0):
                for num in set_SUB2:
                    if(num<maxNum):
                        set_SUB1.add(num)
                for num in set_SUB1:
                    set_SUB2.remove(num)
                num1 = num2
            elif(len(set_SUB2) == 0):
                for num in set_SUB1:
                    if(num<maxNum):
                        set_SUB2.add(num)
                for num in set_SUB2:
                    set_SUB1.remove(num)
                num2 = num1
        res_recordSUB1 = (set_SUB1, num1)
        res_recordSUB2 = (set_SUB2, num2)
        return res_recordAND, res_recordSUB1, res_recordSUB2
# 把区间转化成集合方便做一点
    def turnInter2Set(self, intervals):
        res = []
        for inter in intervals:
            temp = set()
            for i in range(inter[0],inter[1]+1):
                temp.add(i)
            res.append((temp,1))
        return res
    def getResList(self):
        threshold = self.threshold
        srcList = self.set_inter
        while(True):
            print(srcList)
            index,minDistance = self.judgeList(srcList)
            print("minDistance is:", minDistance)
            if(minDistance>=threshold):
                break
            srcList = self.mergeList(srcList,index)
        self.set_inter = srcList
        self.inter_res = self.turnSet2Inter()
    def computeOverlap(self, srcList, index):
        length_list = len(srcList)
        res = index
        if(index == 0):
            res += 1
        elif(index == length_list-1):
            res -= 1
        else:
            res += self.computeOverlapWith3Set(srcList[index], srcList[index-1],srcList[index+1])
        return res
    # 根据三个集合 计算相应的相关度
    def computeOverlapWith3Set(self, AND, SUB1, SUB2):
        srclist = self.src_inter_list
        set_AND = AND[0]
        set_SUB1 = SUB1[0]
        set_SUB2 = SUB2[0]
        set1 = set_AND | set_SUB1
        set2 = set_AND | set_SUB2
        # print(AND,SUB1,SUB2)
        # print(set2)
        inter1 = (min(set1), max(set1))
        inter2 = (min(set2), max(set2))
        num1 = 0
        num2 = 0
        res = 0
        for record in srclist:
            min_record = record[0]
            max_record = record[1]
            if((min_record <= inter1[0]) and (max_record >= inter1[1])):
                num1 += 1
            if((min_record <= inter2[0]) and (max_record >= inter2[1])):
                num2 += 1
        if(num1>=num2):
            res = -1
        else:
            res = 1
        print("与两端的相似度：", num1, num2)
        return res
    def mergeList(self, srcList, index):
        new_index = self.computeOverlap(srcList, index)
        min_index = min([index, new_index])
        max_index = max([index, new_index])
        res_set = srcList[index][0] | srcList[new_index][0]
        num = (srcList[index][1] + srcList[new_index][1]) / 2
        del srcList[min_index]
        del srcList[min_index]
        srcList.insert(min_index,(res_set,num))
        print("合并之后：",srcList)
        return srcList
    def judgeList(self, srcList):
        minDistance = 10000000
        resIndex = -1
        index = 0
        for record in srcList:
            distance = self.computeDis(record)
            if(distance <= minDistance):
                minDistance = distance
                resIndex = index
            index += 1
        return resIndex, minDistance
    def computeDis(self,record):
        num_dis = self.num_dis
        the_inter = 0
        total = 0
        for key in num_dis.keys():
            if(int(key) in record[0]):
                the_inter += 1
            total += 1
        print(the_inter/total)
        return the_inter/total
    # def computeDis(self, record):
    #     max_num = max(record[0])
    #     min_num = min(record[0])
    #     return max_num-min_num + 1
# 将最终的结果还是转化成列表形式
    def turnSet2Inter(self):
        res = []
        interSet = self.set_inter
        for record in interSet:
            max_record = max(record[0])
            min_record = min(record[0])
            res.append(min_record)
            res.append(max_record)
        return res