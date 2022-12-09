import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PedidosService } from 'src/app/services/pedidos/pedidos.service';

@Component({
  selector: 'app-pedidos-table',
  templateUrl: './pedidos-table.component.html',
  styleUrls: ['./pedidos-table.component.scss']
})
export class PedidosTableComponent implements OnInit {

  public dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', "address" , "phone", "number","dishName","price",'total','fecha de entrega', 'message'];

  public loading: boolean = false;
  public restaurantID: string = '';
  public contacts: any[] = [];

  constructor(private dishService: PedidosService,) {  }

  async ngOnInit(): Promise<void> {
    await this.getPedidos();
  }

  async getPedidos(){
    this.loading = true
    let response = await this.dishService.getAll();
    if(response?.code == 200){
      this.dataSource = new MatTableDataSource(response.data.filter((item:any)=>item._id != "6390336e19d93f0014866077" && item._id != "6390324219d93f0014866075" && item._id != "6390335a19d93f0014866076"))
      this.loading = false;
    }
  }

}
