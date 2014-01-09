import numpy
import matplotlib.pyplot as plt
import math
import io

class Point:
    x = 0
    y = 0

    def __init__(self, x=0, y=0):
        assert x < 2 and x > -2
        assert y < 2 and y > -2
        self.x = x
        self.y = y
    def __str__(self):
        return "x: " + str(self.x) + ", y: " + str(self.y) + "\n"

    def val_to_char(self, p):
        if p == 0:
            return '0'
        elif p == 1:
            return '1'
        elif p == -1:
            return '2'
        else:
            print "value is ", p
            assert False

    def command_str(self):
       return self.val_to_char(self.x) + self.val_to_char(self.y) + 'm'


def points_to_string(points):
   return map(lambda p: p.command_str(), points)


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


def accumulate_points(quadrants, x_moves, y_moves):
    quadrants[0].append(Point(1 if x_moves else 0, -1 if y_moves else 0))
    quadrants[1].insert(0, Point(-1 if x_moves else 0, -1 if y_moves else 0))
    quadrants[2].append(Point(-1 if x_moves else 0, 1 if y_moves else 0))
    quadrants[3].insert(0, Point(1 if x_moves else 0, 1 if y_moves else 0))

def bresenham_ellipse(x_radius, y_radius):
    if x_radius == 0 or y_radius == 0:
        return

    quadrants = [[], [], [], []]
    x_radius = abs(x_radius)
    y_radius = abs(y_radius)

    a2_square = 2 * x_radius * x_radius
    b2_square = 2 * y_radius * y_radius
    error = x_radius * x_radius * y_radius

    x = 0
    y = y_radius

    stop_y = 0
    stop_x = a2_square * y_radius


    # draw points while x is growing faster than y
    while stop_y <= stop_x:
        x += 1
        error -= b2_square * (x - 1)
        stop_y += b2_square
        
        y_moves = False
        if error <= 0:
            error += a2_square * (y - 1)
            y -= 1
            stop_x -= a2_square
            y_moves = True
        quadrants[0].append(Point(1, -1 if y_moves else 0))
        quadrants[1].insert(0, Point(-1, -1 if y_moves else 0))
        quadrants[2].append(Point(-1, 1 if y_moves else 0))
        quadrants[3].insert(0, Point(1, 1 if y_moves else 0))

    set1_len = len(quadrants[0])
    set2_len = 0
    error = y_radius * y_radius * x_radius
    x = x_radius
    y = 0

    stop_y = b2_square * x_radius
    stop_x = 0
    while stop_y >= stop_x:
        y += 1
        error -= a2_square * (y - 1)
        stop_x += a2_square;
        x_moves = False

        if error < 0:
            error += b2_square * (x - 1)
            x -= 1 
            stop_y -= b2_square
            x_moves = True

        quadrants[0].insert(set1_len, Point(1 if x_moves else 0, -1))
        quadrants[1].insert(set2_len, Point(-1 if x_moves else 0, -1))
        quadrants[2].insert(set1_len, Point(-1 if x_moves else 0, 1))
        quadrants[3].insert(set2_len, Point(1 if x_moves else 0, 1))
        set2_len += 1
    return [i for quadrant in quadrants for i in quadrant]
#    return [i for i in quadrants[0]]

def ellipse(x_radius, y_radius):

    # move to top of circle
    pre_move_instructions =  moveto(0, y_radius)

    # draw ellipse
    points = bresenham_ellipse(x_radius, y_radius)
    drawing_instructions = points_to_string(points)
    ellipse_instructions = ['dnz'] + drawing_instructions + ['upz']

    # move back to center
    post_move_instructions = moveto(0, -y_radius)

    # glue it all together
    return pre_move_instructions + ellipse_instructions + post_move_instructions

def circle(radius):
    return ellipse(radius, radius)

def lineto(x,y):
    points = bresenham(0,0,x,y)
    drawing_instructions = points_to_string(points)
    return ['dnz'] + drawing_instructions + ['upz']

def moveto(x,y):
    points = bresenham(0,0,x,y)
    drawing_instructions = points_to_string(points)
    return ['upz'] + drawing_instructions

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

if __name__ == '__main__':
    write_points_to_file(circle(100), "100_circle.txt")
    write_points_to_file(bresenham(0,0,50,50), "some_line.txt")
    plot_points(circle(100))
    #plot_points(bresenham(0,0, 10, 20))
