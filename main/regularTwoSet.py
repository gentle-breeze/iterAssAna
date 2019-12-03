class regularTwoSet():
    def __init__(self, wf_num_dis, set1, set2):
        self.wf_num_dis = wf_num_dis
        self.set1 = set1
        self.set2 = set2
    def compute(self):
        # 求出交集和差集
        set1 = self.set1
        set2 = self.set2
        set_AND = set1 & set2
        set_SUB1 = set1 - set_AND
        set_SUB2 = set2 - set_AND
        maxNum = max(set_AND)
        # if len(set_SUB1) == 0 or len(set_SUB2) == 0:
        # 为了匹配包含关系 这里需要对包含关系做一些处理
        if(len(set_SUB1) == 0):
            for num in set_SUB2:
                if(num<maxNum):
                    set_SUB1.add(num)
            for num in set_SUB1:
                set_SUB2.remove(num)
        elif(len(set_SUB2) == 0):
            for num in set_SUB1:
                if(num<maxNum):
                    set_SUB2.add(num)
            for num in set_SUB1:
                set_SUB1.remove(num)
        # 得到那三个集合后，对这三个集合合并为两个集合并返回两个区间
        resSet1, resSet2 = self.mergeInterval(set_AND,set_SUB1,set_SUB2)
        return resSet1, resSet2
        
    def mergeInterval(self, set_AND, set_SUB1, set_SUB2):
        distance1 = self.computeDistance(set_AND, set_SUB1)
        distance2 = self.computeDistance(set_AND, set_SUB2)
        res1 = set()
        res2 = set()
        if(distance1>distance2):
            res1 = set_AND | set_SUB2
            res2 = set_SUB1
        else:
            res1 = set_AND | set_SUB1
            res2 = set_SUB2
        return res1, res2

    def computeDistance(self, set_AND, set_SUB):
        thresh = 0.9
        num_dis = self.wf_num_dis
        num_and = 0
        num_sub = 0
        for num in set_SUB:
            if (str(num) in num_dis):
                num_and += num_dis[str(num)]
        for num in set_AND:
            if(str(num) in num_dis):
                num_sub += num_dis[str(num)]
        rate = num_sub/(num_sub+num_and)
        if(rate > thresh):
            res = rate * (thresh) / (thresh-1) + thresh/(1-thresh)
        else:
            res = rate
        print("compara two set:",set_AND,set_SUB)
        print(res)
        return 1 - res

    # def computeDistance(self, set_AND, set_SUB):
    #     num_dis = self.wf_num_dis
    #     totalNum = 0
    #     totalDis = 0
    #     for num1 in set_AND:
    #         for num2 in set_SUB:
    #             if (str(num1) in num_dis):
    #                 dist1 = num_dis[str(num1)]
    #             else:
    #                 dist1 = 0
    #             if (str(num2) in num_dis):
    #                 dist2 = num_dis[str(num2)]
    #             else:
    #                 dist2 = 0

    #             totalNum += (dist1 + dist2)
    #             totalDis = (dist1 + dist2) * abs(num1 - num2)
    #     res = 0
    #     if(totalNum != 0):
    #         res = totalDis / totalNum
    #     return res
    def getNewSubSet(self, set_AND, interval):
        flag = True
        set_SUB1 = set()
        set_SUB2 = set()
        for i in range(interval[0],interval[1]):
            if(i in set_AND):
                flag = False
            if(flag):
                set_SUB1.add(i)
            else:
                set_SUB2.add(i)
        return set_SUB1, set_SUB2