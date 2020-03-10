import { Component, OnInit } from '@angular/core';
import sigma from 'sigma';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  graph: sigma;
  properties: {
    name: string,
    count: number,
    edgeOffset: number,
    nodeOffset: number
  }[] = [];
  weights: number[][] = [];
  output: number[][] = [];


  constructor() { }

  public input(data: number[]) {
    this.output[0] = [];
    for (let i = 0; i < this.properties[0].count; i++) {
      this.graph.graph.nodes()[i].label = `${data[i]}`;
      this.graph.graph.nodes()[i].labelSize = 30;  // FIXME wrong attribute
      this.output[0].push(data[i])
    }

    this.graph.refresh();
  }

  private feedForward(targetLayer: number) {
    for (let i = 0; i < this.properties[targetLayer].count; i++) {
      var value = 0;
      for (let j = 0; j < this.properties[targetLayer - 1].count; j++) {
        // TODO calculate endge "weights"
        const index = this.properties[targetLayer].edgeOffset + (i*this.properties[targetLayer].count + j);
        const weight = this.weights[targetLayer-1][i*this.properties[targetLayer-1].count + j];

        value += weight * this.output[targetLayer-1][j];

        let color = (Math.round((Math.random() * 20) % 16)).toString();
        this.graph.graph.edges()[index].color = `#${color}${color}${color}`;
      }
      const activatedValue = 1/(1+Math.pow(Math.E, -value));
      this.graph.graph.nodes()[this.properties[targetLayer].nodeOffset + i].label  = `${activatedValue.toPrecision(4)}`;
      this.output[targetLayer].push(activatedValue);
      this.graph.refresh();
    }

  }

  private generateNodeColor(layer: number) {
    if (layer === 0) { return '#4499ff'; }  // Input Layer has fixed color
    return '#' + ((1 << 24) * Math.random() | 0).toString(16);
  }

  private async addLayer(count: number, layer: number, name: string, previous?: string) {
    // NOTE Randomly generated placeholder weights
    if (layer !== 0){
      this.weights.push(Array(count * this.properties[layer - 1].count).fill(2).map(() => Math.random() % 2));
    }

    this.output.push([]); // Initialize empty output for layer

    this.properties.push({
      name: name,
      count: count,
      edgeOffset: this.graph.graph.edges().length,
      nodeOffset: this.graph.graph.nodes().length
    });

    const color: string =  this.generateNodeColor(layer);
    for (let i = 0; i < count; i++) {
      this.graph.graph.addNode({
        id: `${name}-${i}`,
        x: layer,
        y: count / 2 - i, // count/2 is the offset to center the layer
        label: `${name}-${i}`,
        size: 1,
        color: color
      });

      if (!previous) { continue; }

      for (let j = 0; j < this.properties[layer - 1].count; j ++) {
        this.graph.graph.addEdge({
          id: `${previous}${j}-${name}${i}`,
          source: `${previous}-${j}`,
          target: `${name}-${i}`
        });
      }
    }
    this.graph.refresh();
  }

  ngOnInit(): void {
    this.graph = new sigma('container');
    this.graph.settings({
      edgeColor: 'default',
      defaultEdgeColor: '#999',
      batchEdgesDrawing: true,
      sideMargin: 1,
      canvasEdgesBatchSize: 50,
      edgeHoverSizeRatio: 2,
      singleHover: true,
      defaultLabelSize: 18
    });

    this.addLayer(3, 0, 'input');
    this.addLayer(6,1, 'dense_0', 'input');
    this.addLayer(4,2, 'dense_1', 'dense_0');
    this.addLayer(2,3, 'output', 'dense_1');
    this.input([0.2, 0.2, 0.6]);
    this.feedForward(1);
    this.feedForward(2);
    this.feedForward(3);
  }
}
