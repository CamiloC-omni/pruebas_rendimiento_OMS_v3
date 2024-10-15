
count = 0;

// for (let i = 0; i < 10; i++) { 
    
//     count = count + 3;

//     console.log(`Numer: ${count}`);
// }

// const array = ["A","B","C","D"];

// for (let i = 0; i < array.length; i++) {
//     console.log(`Elemento: ${array[i]}`);
// }
const palabras = [
    "reconocer",  // palíndromo
    "gato",       // no palíndromo
    "salas",      // palíndromo
    "perro",      // no palíndromo
    "radar",      // palíndromo
    "sol",        // no palíndromo
    "anilina",    // palíndromo
    "casa",       // no palíndromo
    "oso",        // palíndromo
    "flor"        // no palíndromo
  ];


for (let i = 0; i < palabras.length; i++) { 
    
    const palindromo = palabras[i].split('').reverse().join('');

    if ( palabras[i] === palindromo){
        console.log("La Palabra " + palabras[i] + " " + palindromo + " Es palindroma");
    } else {
        console.log("La Palabra " + palabras[i] + " " + palindromo + " No es palindroma");
    }

}