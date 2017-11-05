class MarchCube2D {
    constructor(grids_x, grids_y, grid_width, grid_height) {

        this.grids_x = grids_x;
        this.grids_y = grids_y;
        this.grid_width = grid_width;
        this.grid_height = grid_height;

        this.initCases();

        this.vertices = new Array(grids_y+1);
        for(var i=0; i<=grids_y; i++) {
            this.vertices[i] = new Array(grids_x+1);
            this.vertices[i].fill(false);
        }
    }

    initCases() {
        this.cases = new Array(16);
        this.cases[0] = [];
        this.cases[1] = ['bc'];
        this.cases[2] = ['cd'];
        this.cases[3] = ['bd'];
        this.cases[4] = ['ad'];
        this.cases[5] = ['ba', 'cd'];
        this.cases[6] = ['ac'];
        this.cases[7] = ['ab'];
        this.cases[8] = ['ab'];
        this.cases[9] = ['ac'];
        this.cases[10] = ['bc', 'ad'];
        this.cases[11] = ['ad'];
        this.cases[12] = ['bd'];
        this.cases[13] = ['cd'];
        this.cases[14] = ['bc'];
        this.cases[15] = [];

        this.points = {
            'a': [this.grid_width/2, 0],
            'b': [0, this.grid_height/2],
            'c': [this.grid_width/2, this.grid_height],
            'd': [this.grid_width, this.grid_height/2],
        };
    }

    toggleVertex(x, y) {
        return this.vertices[y][x] = !this.vertices[y][x];
    }

    render(layerBase, layer, offset={x:0, y:0}) {
        
        for(var i=0; i<=this.grids_x; i++) {
            var points = [
                i*this.grid_width+offset['x'],
                offset['y'],
                i*this.grid_width+offset['x'],
                this.grids_y*this.grid_height+offset['y']
            ];
            var line = new Konva.Line({
                points: points,
                stroke: 'black',
                strokeWidth: 1,
                lineCap: 'round'
                //lineJoin: 'round'
              });
            layerBase.add(line);
        }

        for(var i=0; i<=this.grids_x; i++) {
            var points = [
                offset['x'],
                i*this.grid_height+offset['y'],
                this.grids_x*this.grid_width+offset['x'],
                i*this.grid_height+offset['y']
            ];
            var line = new Konva.Line({
                points: points,
                stroke: 'black',
                strokeWidth: 1,
                lineCap: 'round'
                //lineJoin: 'round'
              });
            layerBase.add(line);
        }

        var that = this;

        // draw vertices..
        for(var i=0; i<=this.grids_y; i++) {
            for(var j=0; j<=this.grids_x; j++) {
                var color = this.vertices[i][j]? 'red': 'black';
                var vertex = new Konva.Circle({
                    x: j*this.grid_width+offset['x'],
                    y: i*this.grid_height+offset['y'],
                    radius: this.grid_width/8,
                    fill: color,
                    stroke: 'black',
                    strokeWidth: 2
                });

                vertex._index = {x: j, y: i};
                vertex.on('click', function() {
                    let val = that.toggleVertex(this._index['x'], this._index['y']);
                    var fill = val ? 'red' : 'black';
                    this.fill(fill);
                    layerBase.draw();

                    that.renderMC(layer, offset);
                });
                layerBase.add(vertex);
            }
        }
        this.renderMC(layer, offset);
    }

    renderMC(layer, offset={x:0, y:0}) {
        layer.clear();
        layer.destroyChildren();
       

        for(var i=0; i<this.grids_y; i++) {
            for(var j=0; j<this.grids_x; j++) {
                var grid = this.vertices[i+1][j] ? 1: 0;
                grid += this.vertices[i+1][j+1] ? 2: 0;
                grid += this.vertices[i][j+1] ? 4: 0;
                grid += this.vertices[i][j] ? 8: 0;

                var offset_ = {
                    x: this.grid_width*j+offset['x'],
                    y: this.grid_height*i+offset['y']
                };

                this._drawLine(layer, grid, offset_);
                layer.draw();
            }
        }
        layer.draw();
    }

    _drawLine(layer, l, offset) {
        
        this.cases[l].forEach((val) => {
            var points = [];
            points.push(this.points[val[0]][0]+offset['x']);
            points.push(this.points[val[0]][1]+offset['y']);
            points.push(this.points[val[1]][0]+offset['x']);
            points.push(this.points[val[1]][1]+offset['y']);
            var line = new Konva.Line({
                points: points,
                stroke: 'black',
                strokeWidth: 2,
                lineCap: 'round'
                //lineJoin: 'round'
            });
            layer.add(line);
        });

    }
};