(self.webpackChunkEasyST=self.webpackChunkEasyST||[]).push([[9693],{9258:(s,t,e)=>{"use strict";e.d(t,{K:()=>c});var n=e(6274),o=e(8620),i=e(2741);let c=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=i.oAB({type:s}),s.\u0275inj=i.cJS({imports:[[n.ez,o.Pc]]}),s})()},9693:(s,t,e)=>{"use strict";e.r(t),e.d(t,{MessagePageModule:()=>T});var n=e(6274),o=e(4988),i=e(8620),c=e(1626),r=e(1855),a=e(6334),l=e(4480),d=e(2741),u=e(8903),g=e(3883);function h(s,t){if(1&s&&(d.TgZ(0,"ion-card"),d.TgZ(1,"ion-card-content"),d._uU(2),d.qZA(),d.qZA()),2&s){const s=t.$implicit;d.Tol(s.css||"card2"),d.xp6(2),d.hij(" ",s.mensaje," ")}}const m=[{path:"",component:(()=>{class s{constructor(s){this.loadingSvc=s,this.userName="Usuario",this.userTaxi="Taxista",this.message="",this.messages=[],this.auth=(0,l.v0)(),this.uid=this.auth.currentUser.uid,this.db=(0,a.N8)(),this.dbRef=(0,a.iH)(this.db,"/Mensajes/"+this.uid),this.getMessage()}ngOnInit(){}getMessage(){return(0,r.mG)(this,void 0,void 0,function*(){let s=0;this.loadingSvc.cargando();try{(0,a.jM)(this.dbRef,t=>{this.messages=[],t.forEach(t=>{const e=t.val();0===s&&(this.userTaxi=e.nombre,s++),this.messages.push(e),this.scrollToBottom()})}),this.scrollToBottom()}catch(t){console.log("Error->",t)}this.loadingSvc.dismiss(),this.scrollToBottom()})}scrollToBottom(){this.content.scrollToBottom(3e3)}sendMessage(){if(""!==this.message){const s=(0,a.VF)(this.dbRef);(0,a.t8)(s,{mensaje:this.message,nombre:this.userName,css:"card"}),this.message=""}}}return s.\u0275fac=function(t){return new(t||s)(d.Y36(u.b))},s.\u0275cmp=d.Xpm({type:s,selectors:[["app-message"]],viewQuery:function(s,t){if(1&s&&d.Gf(i.W2,5),2&s){let s;d.iGM(s=d.CRH())&&(t.content=s.first)}},decls:12,vars:4,consts:[[3,"titulo"],["padding","","id","content",3,"scrollEvents"],["content",""],[3,"class",4,"ngFor","ngForOf"],["id","content-end"],["contentEnd",""],["placeholder","escribe algo...",3,"ngModel","ngModelChange"],["icon-left","","end","",3,"click"],["name","send"]],template:function(s,t){1&s&&(d._UZ(0,"app-header",0),d.TgZ(1,"ion-content",1,2),d.YNc(3,h,3,4,"ion-card",3),d.qZA(),d._UZ(4,"div",4,5),d.TgZ(6,"ion-footer"),d.TgZ(7,"ion-toolbar"),d.TgZ(8,"ion-input",6),d.NdJ("ngModelChange",function(s){return t.message=s}),d.TgZ(9,"ion-button",7),d.NdJ("click",function(){return t.sendMessage()}),d._UZ(10,"ion-icon",8),d._uU(11," Enviar "),d.qZA(),d.qZA(),d.qZA(),d.qZA()),2&s&&(d.MGl("titulo","Chat ",t.userTaxi,""),d.xp6(1),d.Q6J("scrollEvents",!0),d.xp6(2),d.Q6J("ngForOf",t.messages),d.xp6(5),d.Q6J("ngModel",t.message))},directives:[g.G,i.W2,n.sg,i.fr,i.sr,i.pK,i.j9,o.JJ,o.On,i.YG,i.gu,i.PM,i.FN],styles:[".card[_ngcontent-%COMP%]{background:#16b800;color:#fff;text-align:right}.card2[_ngcontent-%COMP%]{color:#111}"]}),s})()}];let f=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=d.oAB({type:s}),s.\u0275inj=d.cJS({imports:[[c.Bz.forChild(m)],c.Bz]}),s})();var p=e(9258);let T=(()=>{class s{}return s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=d.oAB({type:s}),s.\u0275inj=d.cJS({imports:[[n.ez,o.u5,i.Pc,f,p.K]]}),s})()}}]);