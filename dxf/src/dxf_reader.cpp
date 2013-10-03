#include "dxflib/dl_dxf.h"
#include "dxflib/dl_creationadapter.h"
#include <stdio.h>

class DXFReader: public DL_CreationAdapter {
	public:
    	
    virtual void addVertex(const DL_VertexData& data)
    {
		printf("Vertex to (%f, %f, %f)\n", data.x, data.y, data.z);
    }

	virtual void addLine(const DL_LineData& data)
	{
		printf("Line starting at (%f, %f, %f) ending at (%f, %f, %f)\n", data.x1, data.y1, data.z1, data.x2, data.y2, data.z2);
	}
};

int main(int argc, const char ** argv)
{
    if (argc < 2)
    {
        printf("Please provide file name as argument.\n");
        return 0;
    }

    DL_Dxf dxf_file;
    DXFReader dxf_parser;
    if (!dxf_file.in(argv[1], &dxf_parser))
    {
        printf("Could not open dxf file.\n");
    }
	return 0;
}
