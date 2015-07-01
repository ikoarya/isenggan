/*
    Versi 2

    Upgrade:
  v  a. Tambah kolom path gambar pada tabel user
  v  b. Tambah GetJmlAkun
  v  c. Tambah GetPicture
  v  d. Penyesuaian Halaman Pendaftaran   ==> EntryUser()
  v  e. Penyesuaian Halaman Utama  ==> HalamanUtama(), dan hitungUmur dan GetPicture
    f. Penyesuaian Halaman Terapi
    g. Penyesuaian Halaman evaluasi    ==> tesEvaluasi()
    h. Penyesuaian Halaman Display Evaluasi   ==> DisplayEvaluasi()
  v  i. Penyesuaian Halaman Pengaturan
  v  j. Penyesuaian Halaman Login
    
*/




      var db;
	    var shortName = 'Cakra';
	    var version = '1.0';
	    var displayName = 'CakraDB';
	    var maxSize = 65535;
	    var flagevaluasi = 0;
      var linkPT;
      var pathimage;

//============================================= notification error =======================================================

	    // this is called when an error happens in a transaction
	      function errorHandler(transaction, error) {
	         alert('Error: ' + error.message + ' code: ' + error.code);
	       
	      }

	      // this is called when a successful transaction happens
	      function successCallBack() {
	         alert("DEBUGGING: success");
	       
	      }
	       
	      function nullHandler(){};



//================================================ buat database ==================================================
	    function RunBody () {
	    	
	    	alert("DEBUGGING: we are in the onBodyLoad() function");

	    	if (!window.openDatabase) {
	           alert('Databases are not supported in this browser.');
	           return;
         	}


         	db = openDatabase(shortName, version, displayName,maxSize);

         	db.transaction(function(tx){
				

				tx.executeSql('create table if not exists AKUN( ID integer primary key autoincrement, NAMA varchar(30) not null, TTL datetime not null, JK char(1) not null, LINKFOTO varchar(40) not null)', [],nullHandler,errorHandler);

	            tx.executeSql('CREATE TABLE IF NOT EXISTS CATATAN(ID_CATATAN integer, tanggal DATETIME not null, catatanku text, countcatatan integer, FOREIGN KEY (ID_CATATAN) REFERENCES AKUN (ID))', [],nullHandler,errorHandler);

	            tx.executeSql('CREATE TABLE IF NOT EXISTS LAPORAN(ID_LAPORAN INTEGER PRIMARY KEY autoincrement, waktu date not null, komunikasi integer, sosial integer, kognitif integer, kebiasaan integer, total integer, countlaporan integer)', [],nullHandler,errorHandler);

	            tx.executeSql('create table if not exists NILAI(ID_NILAI INTEGER PRIMARY KEY autoincrement, ID_AKUN REFERENCES AKUN(ID), BENAR integer not null, SALAH integer not null, DATA varchar(30) not null,TANGGAL date, COUNTNILAI integer)', [],nullHandler,errorHandler);
	            
	            tx.executeSql('create table if not exists PERTANYAAN (ID_PERTANYAAN integer primary key autoincrement, KATEGORI_TANYA varchar(50) not null, SOAL varchar(100) not null)', [],nullHandler,errorHandler);

	            tx.executeSql('create table if not exists TERAPI(ID_TERAPI integer primary key autoincrement, LEVEL integer, PILIHAN varchar(15), KATEGORI_TANYATERAPI varchar(50), ASPEK1 varchar(100), ASPEK2 varchar(100) )', [],nullHandler,errorHandler);

	            tx.executeSql('create table if not exists REWARD( ID_REW INTEGER PRIMARY KEY autoincrement, VIDEO_BENAR varchar(150), VIDEO_SALAH varchar(150), SUARA_BENAR varchar(150),SUARA_SALAH varchar(150))', [],nullHandler,errorHandler);

	            
	            /* Masih Ragu bisa atau gak
         		tx.executeSql('create table if not exists AKUN( ID integer primary key autoincrement, NAMA varchar(30) not null, TTL datetime not null, JK char(1) not null)', [],nullHandler,errorHandler);

         		tx.executeSql('CREATE TABLE IF NOT EXISTS CATATAN(ID_CATATAN integer primary key autoincrement, tanggal DATETIME not null, catatanku text, countcatatan integer autoincrement)', [],nullHandler,errorHandler);

         		tx.executeSql('CREATE TABLE IF NOT EXISTS LAPORAN(ID_LAPORAN integer primary key autoincrement, waktu integer not null, komunikasi integer, sosial integer, kognitif integer, kebiasaan integer, total integer, countlaporan integer autoincrement)', [],nullHandler,errorHandler);

         		tx.executeSql('create table if not exists NILAI(ID_NILAI integer primary key autoincrement, BENAR integer not null, SALAH integer not null, DATA varchar(30) not null,TANGGAL date, COUNTNILAI integer)', [],nullHandler,errorHandler);
         		
         		tx.executeSql('create table if not exists PERTANYAAN (ID_PERTANYAAN integer primary key autoincrement, KATEGORI_TANYA varchar(50) not null, SOAL varchar(100) not null)', [],nullHandler,errorHandler);

         		tx.executeSql('create table if not exists TERAPI(ID_TERAPI integer primary key autoincrement, LEVEL integer, KATEGORI_TANYATERAPI varchar(50), PILIHAN varchar(15), ASPEK1 varchar(100), ASPEK2 varchar(100) )', [],nullHandler,errorHandler);

         		tx.executeSql('create table if not exists REWARD( ID_REW integer primary key autoincrement, VIDEO_BENAR varchar(150), VIDEO_SALAH varchar(150), SUARA_BENAR varchar(150),SUARA_SALAH varchar(150)', [],nullHandler,errorHandler);*/

         	});

			filterquery();
	    }


//=============================================== filter query ======================================================

function filterquery(){

          db.transaction(function(transaction) {
             transaction.executeSql('SELECT * FROM TERAPI;', [],
               function(transaction, result) {
                //alert(result.rows.length);
               
                if (result.rows.length == 0) {
                  EntryTerapi();
                }
               },errorHandler);
           },errorHandler,nullHandler);

        }



//================================================= masukkan user baru =================================================

		function EntryUser(){

			alert("DEBUGGING: we are in the EntryUser() function");

	    	if (!window.openDatabase) {
	           alert('Databases are not supported in this browser.');
	           return;
         	}

         	/*type date tidak bisa berjalan di semua android, maka pakai cara berikut (pisah antara tanggal, bulan dan tahun)

         	var tanggal = document.getElementById('tanggal').value;
	        var bul = document.getElementById('bul').value;
	        var tah = document.getElementById('tah').value;

	        var getYear = tanggal + ' - ' + bul + ' - '+ tah;
			
    			db.transaction(function(transaction) {

    			   transaction.executeSql('INSERT INTO AKUN(NAMA, TTL, JK) VALUES (?,?,?)',[$('#name').val(), getYear, $('#jk').val()],nullHandler,errorHandler);
         	
         	});


	        */

          //beri nama field pengisian dengan id name, ttl dan jk

          var tanggal = document.getElementById('tanggal').value;
          var bul = document.getElementById('bul').value;
          var tah = document.getElementById('tah').value;

          var getBirth = tanggal + ' - ' + bul + ' - '+ tah;
          var link = pathimage;
          sessionStorage.setItem('BirthDate', getBirth);


         	db.transaction(function(transaction){
         		transaction.executeSql('INSERT INTO AKUN(NAMA, TTL, JK, LINKFOTO) VALUES (?,?,?,?)',[$('#name').val(), getBirth, $('#jk').val(),link ],nullHandler,errorHandler);
         	});
		}


//=============================================== login ================================================================

    /* Beri nama id inputnya = username
    */

    function login(){

      if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
      }

      //var value = document.getElementById('username').innerText;
      var val = document.getElementById('username').value;

      db.transaction(function(transaction) {
         transaction.executeSql('SELECT NAMA FROM AKUN WHERE NAMA=?;', [val],
           function(transaction, result) {
            var jml = result.rows.length;
            alert(jml);
            if (jml == 1) {
              window.location.href = "utama.html";
            }
            else{
              alert("Nama tidak sesuai, silahkan isi nama yang sesuai");
            }
           },errorHandler);
       },errorHandler,nullHandler);



    }

//=========================================== Hitung Umur ========================================================

    //dokumentasi = pada form tanggal, beri id = 'tanggal'
    //silahkan pilih alert atau innerHTML(id = age) pada baris paling akhir

    function hitungumur(){

        var jml, thnlahir;
        db.transaction(function(transaction) {
         transaction.executeSql('SELECT TTL FROM AKUN;', [],
           function(transaction, result) {
            jml = result.rows.item(0);
            thnlahir = jml.TTL;
            var panjang = thnlahir.length;
            
            var monthBirth = parseInt(thnlahir[panjang-9] + thnlahir[panjang-8]);
            var yearBirth = parseInt(thnlahir[panjang-4] + thnlahir[panjang-3] + thnlahir[panjang-2] + thnlahir[panjang-1]);
            alert(monthBirth);

            var now = new Date();
            var monthNow = now.getMonth();
            var yearNow = now.getFullYear();

            
            if (monthBirth >= monthNow) {
              age = yearNow - yearBirth -1;    
            }
            else{
              age = yearNow - yearBirth;
            }
            

            alert(age + ' Tahun');
            document.getElementById('umurText').innerHTML = age + ' Tahun';



           },errorHandler);
       },errorHandler,nullHandler);

/*
        var data = sessionStorage.getItem('BirthDate');
        var yearBirth = parseInt(data[jml-3] + data[jml-2] + data[jml-1] + data[jml]);
        //alert(yearBirth);

        var now = new Date();
        var monthNow = now.getMonth();
        var yearNow = now.getFullYear();

        age = yearNow - yearBirth;

        alert(age + ' Tahun');
        document.getElementById('umurText').innerHTML = age + ' Tahun';*/
      }

//=============================================== Get Nama User ======================================================

  //beri nama tempat nama dimunculkan dengan id hasil

  function getNama(){

       if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
      }

      RunBody();
      $('#hasil').html('');
       
       db.transaction(function(transaction) {

         transaction.executeSql('SELECT NAMA FROM AKUN ;',  [],
           function(transaction, result) {

            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                $('#hasil').append(row.NAMA );
            }
           },errorHandler);
       },errorHandler,nullHandler);
  }




//=================================================== Get Jumlah Akun ==========================================================
  //Untuk mengambil jumlah akun, kegunaan saat ada di halaman pengaturan dan lock daftar jika sudah pernah mendaftar (akun > 0).

var row;
  function GetJmlAkun(){
      if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
      }

       
      RunBody();
      $('#jumlahakun').html('');

      db.transaction(function(transaction) {

         transaction.executeSql('SELECT NAMA FROM AKUN ;',  [],
           function(transaction, result) {

            if (result != null && result.rows != null) {
                row = result.rows.length;
                $('#jumlahakun').append(row +' Anak');
            }
           },errorHandler);
       },errorHandler,nullHandler);

      
      
  }


//=================================================== Get Picture =============================================================

function GetPicture(){

       if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
      }

      RunBody();
      $('#gambar').css('');
       
       db.transaction(function(transaction) {

         transaction.executeSql('SELECT LINKFOTO FROM AKUN ;',  [],
           function(transaction, result) {

            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                $('#gambar').append('background-image', 'url(' + row.LINKFOTO +')');
            }
           },errorHandler);
       },errorHandler,nullHandler);
  }




//============================================= Get terakhir melakukan evaluasi ================================================

  //untuk mengetahui terakhir melakukan evaluasi, jadi untuk menentukan bulan tersebut harus evaluasi atau tidak
  //hasil disimpan dalam variabel bulantes

  function getTimeEvaluasi(){

        

        db.transaction(function(transaction) {
        transaction.executeSql('SELECT waktu FROM LAPORAN ;',  [],
           function(transaction, result) {

            if (result != null && result.rows != null) {
              var waktutes = result.rows.length;
              if (waktutes >0) {
                var row = result.rows.item(waktutes-1);
                var hasil = row.waktu;
                var bulantes = parseInt(hasil[3] + hasil[4]);
              }
              else{

                 alert('Anda Belum Melakukan Evaluasi, silahkan lakukan evaluasi')
              }

            }
            
             
            
           },errorHandler);
       },errorHandler,nullHandler);

  }

//=============================================== Halaman Utama ======================================================
  //kumpulan fungsi yang ada di halaman utama, ada getnama, getumur, get waktu terakhir evaluasi

  function HalamanUtama(){
    RunBody();
    getNama();
    hitungumur();
    getTimeEvaluasi();
    GetPicture();
  }

//============================================== Halaman Evaluasi =====================================================

//untuk menampilkan hasil dari evaluasi, berupa nama, nilai komunikasi, sosial, kognitif dan kebiasaan
//sistem kerjanya pake passing parameter, jadi parameter variable hasil evaluasi di pass ke fungsinya.
//nanti hasil dari evaluasi di simpan dulu dan di tampilkan .

  function tesEvaluasi(kom, sos, kog, keb){

      var now = new Date();
      var monthNow = now.getMonth();
      var yearNow = now.getFullYear();
      var datenow = now.getDate();

      var waktu = dateNow + '-' + monthNow + '-' + yearNow;

      db.transaction(function(transaction){

          getNama();

          transaction.executeSql('INSERT INTO LAPORAN(waktu, komunikasi, sosial, kognitif, kebiasaan, total) VALUES (?,?,?,?,?,?)',[waktu, kom, sos, kog, keb],nullHandler,errorHandler);

          transaction.executeSql('SELECT komunikasi, sosial, kognitif, kebiasaan  FROM LAPORAN ;',  [],
             function(transaction, result) {

              if (result != null && result.rows != null) {
                var last = result.rows.length;
                  var row = result.rows.item(last-1);
                  var komResult = row.komunikasi;
                  var sosResult = row.sosial;
                  var kogResult = row.kognitif;
                  var kebResult = row.kebiasaan;
                  alert(komResult);
                  alert(sosResult);
                  alert(kogResult);
                  alert(kebResult);
              }
             },errorHandler);
      });
  }


//=================================================== Terapi =========================================================================

  function terapi(){

       RunBody();

       db.transaction(function(transaction) {
         transaction.executeSql('SELECT ID_TERAPI,LEVEL,PILIHAN,KATEGORI_TANYATERAPI FROM TERAPI ;',  [],
           function(transaction, result) {

              if (result != null && result.rows != null) {
                  for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    $('#cobaterapi').append('<tr><td onClick="linkPetTerapi('+ row.ID_TERAPI + ')">' + row.LEVEL  + '</td><td>' + row.PILIHAN + '</a></td><td><img src="img/'+ row.KATEGORI_TANYATERAPI+'.png"></td></tr>');
                  }
                }
           },errorHandler);
       },errorHandler,nullHandler);
  }
  
     
//================================================== Link Petunjuk Terapi (linkPetTerapi()) ============================================

  function linkPetTerapi(a){

      linkPT = a;
      sessionStorage.setItem('pilihan', linkPT);
      window.location.href = "petterapi.html";
      
  }


//============================================= Link Terapi =================================================================

  function linkterapi(){

    var data = sessionStorage.getItem('pilihan');
    alert(data);


  }

//=============================================== masukkan pertanyaan =================================================

		function EntryQuestion(){

			//field dinamakan kategsoal dan soal

			//alert("DEBUGGING: we are in the EntryQuestion() function");

	    	if (!window.openDatabase) {
	           alert('Databases are not supported in this browser.');
	           return;
         	}

         	db.transaction(function(transaction){
         		transaction.executeSql('INSERT INTO PERTANYAAN(KATEGORI_TANYA, SOAL) VALUES (?,?)',[$('#kategsoal').val(), $('#soal').val()],nullHandler,errorHandler);
         	});
		}



//=============================================== Drop All ======================================================
  function dropAll(){

         if (!window.openDatabase) {
         alert('Databases are not supported in this browser.');
         return;
         }

         $('#lbUsers').html('');
          db.transaction(function(transaction) {
         transaction.executeSql('DROP TABLE AKUN', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE CATATAN', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE LAPORAN', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE NILAI', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE REWARD', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE PERTANYAAN', [], nullHandler,errorHandler);
         transaction.executeSql('DROP TABLE TERAPI', [], nullHandler,errorHandler);
         

         
         });
          
  }