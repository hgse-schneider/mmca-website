file1 = open('data.txt', 'r')
count = 0
 
while True:
 
    line = file1.readline()

    if not line:
        break
    elif "glm" in line:
        continue
    elif "ml" in line:
        continue
    elif "corr" in line:
        continue
    elif "clust" in line:
        continue
    else:
        count += 1
        
    print('{' + '"id":' + str(count) + ", " + '"name":' + f'"{line}"' + ', ' + '"label":' + '""' + ', ' + '"group":' + '"Team C"' + ', ' + '"runtime":' + "1" + '},')
 
file1.close()