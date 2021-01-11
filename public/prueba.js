




function mostrar(input1, input2, input3, input4, input5, input6, input7, input8, input9, input10, input11, input12, input13) {
  document.getElementById("catag1").value = input1
  document.getElementById("catag2").value = input2
  document.getElementById("catag3").value = input3
  document.getElementById("catag4").value = input4
  document.getElementById("catag5").value = input5
  document.getElementById("catag6").value = input6
  document.getElementById("catag7").value = input7
  document.getElementById("catag8").value = input8
  document.getElementById("catag9").value = input9
  document.getElementById("catag10").value = input10
  document.getElementById("catag11").value = input11
  document.getElementById("catag12").value = input12
  document.getElementById("catag13").value = input13
}

function modificarUsuario(input1, input2, input3, input4) {
  document.getElementById("modUsua1").value = input1
  document.getElementById("modUsua2").value = input2
  document.getElementById("modUsua3").value = input3
  document.getElementById("modUsua4").value = input4
}

function modificarStock(input1, input2, input3) {
  document.getElementById("modifStock1").value = input1
  document.getElementById("modifStock2").value = input2
  document.getElementById("modifStock3").value = input3
}


function showw(input) {
  Swal.fire({
    title: '¿Estás seguro?',

    text: "Se eliminará el Motor permanentemente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, elimínalo!',
    cancelButtonText: 'No, conservar',

  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        '¡Eliminando!',
        ' ',
        'success'
      )

      window.location.href = input
    }
  })
}



function eliminarUsuario(input) {
  Swal.fire({
    title: '¿Estás seguro?',

    text: "Se eliminará el Usuario permanentemente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, elimínalo!',
    cancelButtonText: 'No, conservar',

  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        '¡Eliminado!',
        ' ',
        'success'
      )

      window.location.href = input
    }
  })

}


function mensaje(input) {
  Swal.fire(input)
}


function checkRut(rut) {
  var sRut1 = rut.value;      //contador de para saber cuando insertar el . o la -
  if (sRut1.length > 1 && sRut1[sRut1.length - 2] != "-") {
    var sRut = sRut1.substring(0, sRut1.length - 1) + "-" + sRut1[sRut1.length - 1];
    sRut1 = sRut;
  }
  rut.value = sRut1;
}




