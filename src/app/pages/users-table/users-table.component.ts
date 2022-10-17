import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminsService } from 'src/app/services/admins-services/admins.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  public displayedColumns: string[] = ['id', 'name','email', 'action'];
  public dataSource!: MatTableDataSource<any>;
  public loading: boolean = false;
  public userType: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private service: AdminsService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getAdmins();
  }

  async getAdmins() {
    try {
      this.loading = true;
      this.dataSource = new MatTableDataSource();
      var res = await (await this.afs.collection('admins').ref.where('email', '!=', '').get()).docs;
      var users: any = [];
      await Promise.all(
        res.map(async (doc: any) => {
          var currentUser = await this.auth.currentUser;
          users.push(doc.data());
        })
      );
      this.dataSource = new MatTableDataSource(users);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      // this.dataClients = users

      // this.dataSource = new MatTableDataSource(admins);
      this.loading = false;
    } catch (error) {
      this.dataSource = new MatTableDataSource();
      this.loading = false;
      throw error;
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editItem(userId: string) {
    this.router.navigate(['users/edit/' + userId])
  }

  createItem() {
    this.router.navigate(['users/create'])
  }

  deleteItem(item: any) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar este administrador?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: `Si, eliminar`,
      confirmButtonColor: '#06D68F',
      denyButtonText: `Cancelar`,
      denyButtonColor: '#ff3d71',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          text: 'Se está procesando la eliminación',
          icon: 'info',
          timer: 6000,
        });
        Swal.showLoading();

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });

        try {
          await this.service.delete(item.uid);
          Swal.close();
          this.getAdmins();
          Toast.fire({
            icon: 'success',
            title: 'administrador eliminado correctamente',
          });
        } catch (error) {
          Swal.fire(
            'Error al eliminar',
            'Los datos no se han eliminado',
            'error'
          );
        }
      }
    });
  }

}
