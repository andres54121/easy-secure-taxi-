import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { LoadingService } from 'src/app/services/loading.service';
import { delay } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  userName = 'Usuario';
  userTaxi = 'Taxista';
  css: any;
  message = '';
  messages = [];
  auth = getAuth();
  uid = this.auth.currentUser.uid;
  db = getDatabase();
  dbRef = ref(this.db, '/Mensajes/' + this.uid);

  constructor(private loadingSvc: LoadingService) {
    this.getMessage();
  }

  ngOnInit() {
  }

  async getMessage(){
    let a = 0;
    this.loadingSvc.cargando();
    try {
      onValue(this.dbRef, (snapshot) => {
        this.messages = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          if(a === 0){
            this.userTaxi = childData.nombre;
            a++;
          }
          this.messages.push(childData);
          this.scrollToBottom();
        });
      });
      this.scrollToBottom();
    } catch (error) {
      console.log('Error->', error);
    }
    this.loadingSvc.dismiss();
    this.scrollToBottom();
  }

  scrollToBottom(){
    this.content.scrollToBottom(3000);
  }

  sendMessage(){
    if(this.message !== ''){
      const newMessage = push(this.dbRef);
      set(newMessage, {
        mensaje: this.message,
        nombre: this.userName,
        css: 'card'
      });
      this.message = '';
    }
  }
}
