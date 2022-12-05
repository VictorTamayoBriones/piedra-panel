import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DishesService } from 'src/app/services/dishes-services/dishes.service';
import { DishService } from 'src/app/services/dishes/dish.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'email','phone', 'message'];

  public loading: boolean = false;
  public restaurantID: string = '';
  public contacts: any[] = [];

  constructor(private dishService: DishService,) { }

  async ngOnInit(): Promise<void> {
    await this.getContacts();
  }


  async getContacts(){
    this.loading = true
    let response = await this.dishService.getAllContacts();
    if(response?.code == 200){
      this.dataSource = new MatTableDataSource(response.data)
      this.loading = false;
    }
  }
}
