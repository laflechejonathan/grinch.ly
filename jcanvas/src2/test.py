#import numpy
import matplotlib.pyplot as plt

import serial
import time

import math
import io
class Point:
    x = 0
    y = 0
    def __str__(self):
        return "x: " + str(self.x) + ", y: " + str(self.y) + "\n"
def bresenham(x0, y0, x1, y1):
    x0 = int(x0)
    y0= int(y0)
    x1 = int(x1)
    y1 = int(y1)
    dx = abs(x0 - x1)
    dy = abs(y0 - y1)
    if x0 < x1:
        sx = 1
    else:
        sx = -1

    if y0 < y1:
        sy = 1
    else:
        sy = -1
    error = dx - dy
    points = []
    while True:
        p = Point()
        if x0 == x1 and y0 == y1:
            break
        e2 = 2 * error
        if e2 > -dy:
            error -= dy
            p.x = sx
            x0 += sx
        if x0 == x1 and y0 == y1:
            points.append(p)
            break
        if e2 < dx:
            error += dx
            p.y = sy
            y0 += sy
        points.append(p)

    return points

def circle(radius):
    step_size = 0.01

    prev_x = radius * math.cos(0)
    prev_y = radius * math.sin(0)
    points = []

    theta = step_size
    while theta <= 2*math.pi:
        new_x = radius * math.cos(theta)
        new_y = radius * math.sin(theta)
        points += bresenham(prev_x, prev_y, new_x, new_y)
        prev_x = new_x
        prev_y = new_y
        theta += step_size
    return points

def plot_points(p):
    points = p[:]
    for i in range(1, len(points)):
        points[i].x += points[i-1].x
        points[i].y += points[i-1].y
    plt.plot([p.x for p in points], [p.y for p in points])
    plt.show()

def points_to_string(points):
    point_str = ''
    point_str += 'Array Length  ' + str(len(points)) + '\n'
    point_str += 'X axis: \n { '
    
    second = False
    for p in points:
        if second:
            point_str += ', '
        second = True
        if p.x == 1:
            point_str += '1'
        elif p.x == -1:
            point_str += '2'
        elif p.x == 0:
            point_str += '0'
    point_str += '}\n'

    point_str += 'Y axis: \n'
    point_str += '{ '
    
    second = False
    for p in points:
        if second:
            point_str += ', '
        second = True
        if p.y == 1:
            point_str += '1'
        elif p.y == -1:
            point_str += '2'
        elif p.y == 0:
            point_str += '0'
    point_str += '}'
    return point_str
def write_points_to_file(points, path):
    f_handle = open(path, 'w')
    f_handle.write(points_to_string(points))
    f_handle.close()

def write_points_to_serial(points):
    print "Length: ", len(points)
    ser = serial.Serial('COM4', 115200)
    
    while ser.read() != 'y':
        pass
    
    num_to_str = { 0: '0', -1: '2', 1: '1' }
    
    str_points_x = map(lambda x: str(x) if x != -1 else str(2), [p.x for p in points])
    str_points_y = map(lambda y: str(y) if y != -1 else str(2), [p.y for p in points])
    
    
    for x,y in zip(str_points_x, str_points_y):
        print x+y
        ser.write(x+y)
    print 'go'
    ser.write('go');
    time.sleep(5)
    ser.close()

write_points_to_file(circle(100), "100_circle.txt")
write_points_to_file(bresenham(0,0,50,50), "some_line.txt")
#plot_points(circle(100))
#plot_points(bresenham(0,0, 10, 20))

print 'Valid commands are:\n\tc <radius>\n\tl <x1> <y1> <x2> <y2>\n'
while (True):
    command = raw_input()
    command = command.split(' ')
    if command[0] == 'c':
        try:
            radius = int(command[1])
            #plot_points(circle(radius))
            write_points_to_serial(circle(radius))
        except ValueError:
            print ('i want a radius')
    elif command[0] == 'l':
        try:
            print command
            x1 = int(command[1])
            y1 = int(command[2])
            x2 = int(command[3])
            y2 = int(command[4])
            write_points_to_serial(bresenham(x1, y1, x2, y2))
        except ValueError:
            print 'I want 2 (x,y) pairs'
    else:
        print 'Valid commands are:\n\tc <radius>\n\tl <x1> <y1> <x2> <y2>\n'
    

    
    
    