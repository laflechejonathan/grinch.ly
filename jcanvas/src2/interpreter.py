import os
import sys
import rasterizer
import softplotter

def PrintHelpMessage():
    print 'The grinch.ly drawing shell supports the following commands:'
    print '\tellipse <w> <h>'
    print '\tline <x> <y>'
    print '\tmoveto <x> <y>'
    print '\tshow'
    print '\tquit'
    print '\thelp'

plotter = softplotter.SoftwarePlotter()

def ParseCommand(command):
    command = command.strip().split()
    if len(command) < 1:
        return True
    if command[0] == 'ellipse':
        print 'Coming Soon.'
        return True

        radius = int(command[0])
        instructions = rasterizer.circle(radius)
        plotter.ExecuteInstructions(instructions)
    elif command[0] == 'moveto':
        # get target position
        dest_x = int(command[1])
        dest_y = int(command[2])
        # get current position
        position = plotter.GetPosition()
        curr_x = position[0]
        curr_y = position[1]
        # generate instructions
        dx = dest_x - curr_x
        dy = dest_y - curr_y
        instructions = rasterizer.moveto(dx, dy)
        # plot
        plotter.ExecuteInstructions(instructions)
    elif command[0] == 'line':
        x = int(command[1])
        y = int(command[2])
        instructions = rasterizer.line(x,y)
        plotter.ExecuteInstructions(instructions)
    elif command[0] == 'show':
        plotter.ShowPreview()
    elif command[0] == 'quit':
        print 'Goodbye!'
        return False
    elif command[0] == 'help':
        PrintHelpMessage()
    else:
        print command[0], 'is not a supported command.'
        PrintHelpMessage()
    return True

def RunScript(fname):
    f = open(fname, 'r')
    for line in f:
        assert ParseCommand(line)
    plotter.ShowPreview()

if __name__ == '__main__':
    
    script_path = os.path.realpath(__file__)
    script_dir = os.path.dirname(script_path)
    grinch_path = os.path.join(script_dir, 'grinch.txt')
    grinch_resource = open(grinch_path, 'r')
    print grinch_resource.read()
    print 'Welcome to the grinch.ly drawing shell.'


    if len(sys.argv) == 2:
        RunScript(sys.argv[1])
    else:
        while ParseCommand(raw_input()):
            pass
   
