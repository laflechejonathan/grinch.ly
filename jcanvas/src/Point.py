
class Point:

    def __init__(self, x, y):
        if x < 0 or y < 0:
            raise Exception("Cannot be negative")
        self.x = x
        self.y = y

    def __eq__(self, other):
        if isinstance(other, Point):
            return self.x == other.x and self.y == other.y

    def __ne__(self, other):
        result = self.__eq__(other)
        if result is NotImplemented:
            return result
        return not result