import numpy
import matplotlib.pyplot as plt
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
    while theta < 2*math.pi:
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

def write_points_to_file(points, path):
    f_handle = open(path, 'w')

    f_handle.write("Array Length  " + str(len(points)) + "\n" )

    f_handle.write('X axis: \n')
    f_handle.write('{ ')
    second = False
    for p in points:
        if second:
            f_handle.write(', ')
        second = True
        if p.x == 1:
            f_handle.write('1')
        elif p.x == -1:
            f_handle.write('2')
        elif p.x == 0:
            f_handle.write('0')
    f_handle.write("}")

    f_handle.write('Y axis: \n')
    f_handle.write('{ ')
    second = False
    for p in points:
        if second:
            f_handle.write(', ')
        second = True
        if p.y == 1:
            f_handle.write('1')
        elif p.y == -1:
            f_handle.write('2')
        elif p.y == 0:
            f_handle.write('0')
    f_handle.write("}")

    f_handle.close()


write_points_to_file(circle(100), "100_circle.txt")
write_points_to_file(bresenham(0,0,50,50), "some_line.txt")
plot_points(circle(100))
#plot_points(bresenham(0,0, 10, 20))
