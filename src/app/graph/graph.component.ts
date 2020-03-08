import { Component, OnInit } from '@angular/core';
import sigma from 'sigma';
// declare module sigma: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  graph: sigma;
  properties: {
    name: string,
    count: number
  }[] = [];


  constructor() { }


  private async addLayer(count: number, layer: number, name: string, previous?: string) {
    this.properties.push({
      name: name,
      count: count
    });

    for (let i = 0; i < count; i++) {
      this.graph.graph.addNode({
        id: `${name}-${i}`,
        x: i / 2,
        y: layer,
        label: `${name}-${i}`,
        size: 1
      });

      if (!previous) { continue; }

      // for (let j = 0; j < this.properties.reverse()[1].count; j ++) {
      //   this.graph.graph.addEdge({
      //     id: `${previous}${j}-${name}${i}`,
      //     source: `${previous}-${j}`,
      //     target: `${name}-${i}`
      //   });
      // }
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
      canvasEdgesBatchSize: 5,
      edgeHoverSizeRatio: 2
    });

    this.addLayer(5, 0, 'input');
    this.addLayer(10, 1, 'dense', 'input');
    this.addLayer(10, 2, 'dense_2', 'dense');
    console.log(this.graph.graph.nodes());
  }
}
