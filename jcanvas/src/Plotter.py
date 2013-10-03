from Point import Point

class Plotter:
    
    def __init__(self, initial_state):
        self.state = initial_state

    def line_to(self, point):
        if self.state == point: 
            return
        slope = self._calculate_slope(self.state, point)
        points = self._generate_points(self.state, point, slope)
        self._draw(points)
    
    def move_to(self, point):
        self.state = point

    def _calculate_slope(self, point_1, point_2):
        y_diff = point_2.y - point_1.y
        x_diff = point_2.x - point_1.x
        gcd = self._gcd(y_diff, x_diff)
        return (y_diff / gcd, x_diff / gcd)

    def _generate_points(self, point_1, point_2, slope):
        current_point = point_1
        points = [current_point]
        while current_point != point_2:
            current_point = Point(current_point.x + slope[1], 
                                  current_point.y + slope[0])
            points.append(current_point)
        return points

    def _draw(self, points):
        print "Now Drawing..."
        for point in points:
            print "Plotting point:", point

    def _gcd(self, a, b):
        while b:
            a, b = b, a % b
        return abs(a)

