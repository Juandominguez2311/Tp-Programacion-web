import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';
import {Alumno,Pais} from '../../modelos/alumno';
import {ActivatedRoute,Router} from '@angular/router';
import {AlumnoService} from '../../servicios/alumno.service';
 
@Component({
  selector: 'app-formulario-alumno',
  templateUrl: './formulario-alumno.component.html',
  styleUrls: ['./formulario-alumno.component.css']
})
export class FormularioAlumnoComponent implements OnInit {

  formAlumno:FormGroup;
  alumnoId:number;
  paises: Pais[];
  titulo: string;
  paisSeleccionado:Pais;
  estados:string[];

  constructor(private fb: FormBuilder,
              private AlumnoSrv: AlumnoService,
              private activatedRoute:ActivatedRoute,
              private router:Router
              ) { }

  ngOnInit() { 

    this.formAlumno=this.fb.group({
      nombre:'',
      apellido:'',
      fecha:'',
      pais:[null],
      estado:'',
    });
    this.paises=[
      {id:1,descripcion:"Argentina"},
      {id:2,descripcion:"Brasil"},
      {id:3,descripcion:"Uruguay"},
      {id:4,descripcion:"Chile"},
      {id:5,descripcion:"Paraguay"},
    ];
    this.estados=["aprobado","reprobado","cursando"];

    this.activatedRoute.params.subscribe(
      params => {
        this.alumnoId= params['id'];
        console.log("Alumno id: " + this.alumnoId);
        if(isNaN(this.alumnoId)){
          //no es numerico
          this.titulo="Ingresar nuevo alumno";
          return;
        }
        else{
          //es numerico
          
          var alumno=this.AlumnoSrv.Buscar(this.alumnoId); 
          this.titulo="Modificar los datos del alumno: " + alumno.nombre + " " + alumno.apellido;

          //llenar campos del formulario
          this.formAlumno.patchValue({
            nombre:alumno.nombre,
            apellido:alumno.apellido,
            fecha:this.formatDate(alumno.fecha),
            pais:alumno.pais,
            estado:alumno.estado
          });
          //this.formAlumno.controls['pais'].patchValue(alumno.pais);
        }
      }
    );
  }
  GuardarFormulario(){
    
    let alumno: Alumno=Object.assign({},this.formAlumno.value);
    alumno.id=+this.alumnoId; 

      if(alumno.id>0){
        //editamos
        this.AlumnoSrv.Editar(alumno);
      }
      else{
        //creamos
        this.AlumnoSrv.Crear(alumno);
      }
      this.router.navigate(["/alumnos"])
      
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }



compareFn(c1: Pais, c2: Pais): boolean { 
  return c1 && c2 ? c1.id === c2.id : c1 === c2;
}

}
