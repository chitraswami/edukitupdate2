import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  address: any;

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${environment.URL}/auth/register`, data);
  }

  signin(data: any): Observable<any> {
    return this.http.post(`${environment.URL}/auth/login`, data);
  }


  getProfile(): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    return this.http.get(`${environment.URL}/auth/profile`, {
      headers: headers,
    }).pipe(
      tap((res: any) => {
        if (res.success) {
          this.address = res.data.address;
          console.log("Initial address:", this.address);

        }
      })
    );
  }



  updateAddress(address: any): Observable<any> {
    console.log("updateadress")
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };

    return this.http.put(`${environment.URL}/auth/address`,address,  {
      headers: headers,
    }).pipe(
      tap((res: any) => {
        this.address = res.data;
        console.log("Updated address:", this.address);

      })
    );
  }


  getAddress(): Observable<any> {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    return this.http.get(`${environment.URL}/auth/profile`, {
      headers: headers,
    });
  }


}
