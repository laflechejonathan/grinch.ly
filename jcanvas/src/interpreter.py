import os
import sys
import rasterizer
import softplotter

def PrintHelpMessage():
    print 'The grinch.ly drawing shell supports the following commands:\n'
    print 'ellipse <x radius> <y radius>'
    print 'circle <radius>'
    print 'lineto <x> <y>'
    print 'moveto <x> <y>'
    print 'pos'
    print 'show'
    print 'quit'
    print 'help'

plotter = softplotter.SoftwarePlotter()

def ParseCommand(command):
    try:
        command = command.strip().split()
        if len(command) < 1:
            return True

        if command[0] == 'ellipse':
            x_rad = int(command[1])
            y_rad = int(command[2])
            instructions = rasterizer.ellipse(x_rad, y_rad)
            plotter.ExecuteInstructions(instructions)
        elif command[0] == 'circle':
            radius = int(command[1])
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

        elif command[0] == 'lineto':
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
            instructions = rasterizer.lineto(dx, dy)
            # plot
            plotter.ExecuteInstructions(instructions)

        elif command[0] == 'pos':
            position = plotter.GetPosition()
            print 'Current Plotter Position:\n\nx:%d\ny:%d' % (position[0], position[1])
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
    except ValueError:
        print 'Could not process input. type \'help\' for more information.'
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
   
