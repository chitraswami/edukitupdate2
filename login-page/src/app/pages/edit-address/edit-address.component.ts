import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  EditAddressForm: FormGroup;
  address: any;
  pinCode:any;
  userId: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.EditAddressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
    });

    // if (this.EditAddressForm) {
    //   this.EditAddressForm.patchValue(this.address);
    // }
 this.auth.getAddress().subscribe(

      (res) => {
        console.log(res)
        this.userId = res.data._id
        this.address = res.data;
        let  updatedAddress = {

          addressLine1: res.data.addressLine1,
          city:  res.data.city,
          state: res.data.state,
          postalCode:res.data.postalCode,
        }
        this.EditAddressForm.patchValue(updatedAddress);
      },
      (err) => {
        console.log(err);
      }
    );

    this.EditAddressForm?.get('postalCode')?.valueChanges.subscribe((postalCode: string) => {
      if (postalCode.length === 6) {
        this.http.get<any>(`https://api.postalpincode.in/pincode/${postalCode}`).subscribe(res => {
          if (res[0].Status === "Success") {
            const postOffice = res[0].PostOffice[0];

            this.address = {
              addressLine1: postOffice.Name,
              city: postOffice.District,
              state: postOffice.State,
              // postalCode: postalCode
            };

              this.pinCode = postalCode

            this.EditAddressForm.patchValue(this.address);
          }
        });
      }
    });
  }

  ngOnInit(): void {

    this.EditAddressForm.patchValue(this.address);
  }


onSubmit() {
  console.log(this.userId);
  const updatedAddress = {
    ...this.address,
    addressLine1: this.address.addressLine1,
    city: this.address.city,
    state: this.address.state,
    postalCode:this.pinCode,
    userid:this.userId
  };
  // if (this.EditAddressForm.valid) {
  // const updatedAddress = {
  // ...this.address,
  // ...this.EditAddressForm.value
  // };
  this.auth.updateAddress(updatedAddress).subscribe(
  (res) => {
  console.log(res);
  this.router.navigate(['/profile']);
  },
  (err) => {
  console.log(err);
  }
  );
  }
  }








