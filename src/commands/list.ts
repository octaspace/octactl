import { Table } from 'console-table-printer';

import { Octa, KeyError, ApiError } from "@octaspace/api.js";
import { fetchFile } from "../helpers/storage";

export async function displayVPNNodes() {
  try {
    const key = fetchFile("key");
    const data = await new Octa(key).getVPNNodes();

    const p = new Table({
      columns: [
        { name: 'node_id', title: 'Node ID', alignment: 'center' },
        { name: 'country', title: 'Country', alignment: 'center' },
        { name: 'speed', title: 'Speed ↑↓', alignment: 'center' },
        { name: 'reliability', title: 'Reliability', alignment: 'center' },
        { name: 'price', title: 'Price', alignment: 'center' }
      ]}
    );

    data.forEach((node) => {
      p.addRow({
        'node_id': node['node_id'],
        'country': node['country'],
        'speed': `${Math.round(node['net_up_mbs'] / 1024 / 1024)} | ${Math.round(node['net_down_mbs'] / 1024 / 1024)}`,
        'reliability': (node['reliability']).toFixed(2),
        'price': (node['traffic_price'] / 100).toFixed(2)
      });
    });

    p.printTable();
  } catch (err: any) {
    if (err instanceof KeyError) {
      console.log("Please Login");
      return;
    }
    if (err instanceof ApiError) {
      console.log("Network Error");
      return;
    }
    console.log(err.message);
  }
}
