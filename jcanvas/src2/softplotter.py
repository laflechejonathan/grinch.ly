import matplotlib.pyplot as plt

#   Define Instruction Set as:
#
#   [0/1/2] [0/1/2] m       ## Move X/Y axis
#   upz                     ## Pen Up
#   dnz                     ## Pen Down

def Move(value, direction):
    if direction == '1':
        return value + 1
    elif direction == '2':
        return value - 1
    elif direction == '0':
        return value
    else:
        assert False

class SoftwarePlotter:
    _pen_down = False
    _xpos = 0
    _ypos = 0
    _xpts = []
    _ypts = []

    def ExecuteInstructions(self, instructions):
        for instruct in instructions:
            assert len(instruct) == 3
            if instruct[2] == 'm':
                old_x = self._xpos
                old_y = self._ypos
                self._xpos = Move(self._xpos, instruct[0])
                self._ypos = Move(self._ypos, instruct[1])
                if self._pen_down:
                    self._xpts.append([old_x, self._xpos])
                    self._ypts.append([old_y, self._ypos])
            elif instruct[2] == 'z':
                if instruct[:2] == 'up':
                    self._pen_down = False
                elif instruct[:2] == 'dn':
                    self._pen_down = True
                else:
                    print instruct[:2]
                    assert False
            else:
                assert False

    def GetPosition(self):
        return (self._xpos, self._ypos)

    def ShowPreview(self):
        for item in zip(self._xpts, self._ypts):
            plt.plot(item[0], item[1], color='black')
        plt.show()
