import { Component, OnInit } from '@angular/core';
import sigma from 'sigma';
declare const sigma: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  graph: sigma;


  constructor() { }


  private addLayer(count: any, layer:any, name: string, previous: string) {
    for (var i = 0; i < count; i++) {
      this.graph.graph.addNode({
        id: `${name}-${i}`,
        x: i/2,
        y: layer,
        label: `${name}-${i}`,
        size: 4
      });
      if (previous == '') {
        continue
      }

      for (var j = 0; j < 5; j ++) {
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
      defaultEdgeColor: '#999'
    })
    this.addLayer(5, 0, 'input', '');
    this.addLayer(10, 1, 'dense', 'input');
  }

}
