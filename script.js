const listaTeme = document.getElementById("listaTeme");
const continutLectie = document.getElementById("continutLectie");
const cautare = document.getElementById("cautare");

const cheiLectii = Object.keys(lectii);

let lectieCurenta = 0;

// Afiseaza lista temelor
function afiseazaTeme(filtru = ""){

    listaTeme.innerHTML = "";

    cheiLectii.forEach((id,index)=>{

        const lectie = lectii[id];

        if(lectie.titlu.toLowerCase().includes(filtru.toLowerCase())){

            const buton = document.createElement("button");

            buton.className = "tema";

            buton.textContent = lectie.titlu;

            buton.onclick = ()=>{

                lectieCurenta=index;

                deschideLectia(id);

            };

            listaTeme.appendChild(buton);

        }

    });

}

// Deschide lectia
function deschideLectia(id){

    const lectie = lectii[id];

    continutLectie.innerHTML=`

        <div class="lectie">

            <h1>${lectie.titlu}</h1>

            ${lectie.continut}

            <hr>

            <div class="optiuni">

                <button onclick="incepeTest('${id}')">

                    📝 Testează-te

                </button>

                <button onclick="temaUrmatoare()">

                    ➡️ Tema următoare

                </button>

            </div>

        </div>

    `;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// Porneste testul
function incepeTest(id){

    const lectie = lectii[id];

    const test = lectie ? lectie.intrebari : null;

    if(!test || test.length === 0){

        alert("Această lecție nu are încă un test.");

        return;

    }

    let html=`

    <div class="lectie">

    <h1>Test: ${lectie.titlu}</h1>

    `;

    test.forEach((q,index)=>{

        html+=`

        <div class="intrebare">

        <h3>${index+1}. ${q.intrebare}</h3>

        `;

        q.variante.forEach((v,i)=>{

            html+=`

            <label class="varianta">

                <input

                    type="radio"

                    name="q${index}"

                    value="${i}"

                >

                <span class="varianta-text">${v}</span>

                <span class="varianta-icon"></span>

            </label>

            `;

        });

        html+="</div>";

    });

    html+=`

        <button

            class="verifica"

            onclick="verificaTest('${id}')"

        >

            Verifică răspunsurile

        </button>

    </div>

    `;

    continutLectie.innerHTML=html;

    // Feedback vizual instant la alegerea unui raspuns
    document.querySelectorAll(".intrebare").forEach((intrebareDiv, index)=>{

        const inputuri = intrebareDiv.querySelectorAll('input[type="radio"]');

        inputuri.forEach((input)=>{

            input.addEventListener("change", function(){

                marcheazaIntrebare(test[index], intrebareDiv, this);

            });

        });

    });

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

// Marcheaza raspunsul ales (bifa verde / x rosu)
function marcheazaIntrebare(q, intrebareDiv, inputSelectat){

    const toateInputurile = intrebareDiv.querySelectorAll('input[type="radio"]');

    toateInputurile.forEach((input)=>{

        const label = input.closest("label");

        const valoare = Number(input.value);

        label.classList.remove("corect","gresit");

        if(valoare === q.raspunsCorect){

            label.classList.add("corect");

        } else if(input === inputSelectat){

            label.classList.add("gresit");

        }

        input.disabled = true;

    });

}

// Verifica testul
function verificaTest(id){

    const test = lectii[id].intrebari;

    let punctaj=0;

    test.forEach((q,index)=>{

        const raspuns=document.querySelector(

            `input[name="q${index}"]:checked`

        );

        if(raspuns){

            if(Number(raspuns.value)===q.raspunsCorect){

                punctaj++;

            }

        }

    });

    afiseazaRezultat(punctaj, test.length);

}

// Afiseaza rezultatul testului intr-un popup personalizat
function afiseazaRezultat(punctaj, total){

    const existent = document.querySelector(".rezultat-overlay");

    if(existent){

        existent.remove();

    }

    const procent = Math.round((punctaj/total)*100);

    let mesaj = "";
    let clasaMesaj = "";

    if(procent === 100){

        mesaj = "Excelent! Ai răspuns perfect! 🏆";
        clasaMesaj = "rezultat-perfect";

    } else if(procent >= 60){

        mesaj = "Bine lucrat! Mai exersează puțin. 👍";
        clasaMesaj = "rezultat-bine";

    } else {

        mesaj = "Mai ai de învățat la această temă. 💪";
        clasaMesaj = "rezultat-slab";

    }

    const overlay = document.createElement("div");
    overlay.className = "rezultat-overlay";

    overlay.innerHTML = `

        <div class="rezultat-card">

            <div class="rezultat-scor ${clasaMesaj}">

                <span class="rezultat-numar">${punctaj}</span>

                <span class="rezultat-din">/ ${total}</span>

            </div>

            <div class="rezultat-bara-fundal">

                <div class="rezultat-bara-umplere ${clasaMesaj}" style="width:${procent}%"></div>

            </div>

            <p class="rezultat-mesaj">${mesaj}</p>

            <button class="rezultat-buton">Am înțeles</button>

        </div>

    `;

    document.body.appendChild(overlay);

    const inchide = ()=>{

        overlay.classList.add("rezultat-inchidere");

        setTimeout(()=>{

            overlay.remove();

        }, 200);

    };

    overlay.querySelector(".rezultat-buton").onclick = inchide;

    overlay.addEventListener("click", function(e){

        if(e.target === overlay){

            inchide();

        }

    });

}

// Tema urmatoare
function temaUrmatoare(){

    lectieCurenta++;

    if(lectieCurenta>=cheiLectii.length){

        lectieCurenta=0;

    }

    deschideLectia(

        cheiLectii[lectieCurenta]

    );

}

// Cautare
cautare.addEventListener("input",function(){

    afiseazaTeme(this.value);

});

// Pornire
afiseazaTeme();

continutLectie.innerHTML=`

<div class="lectie">

<h1>Bine ai venit!</h1>

<p>

Selectează o temă din meniul din stânga pentru a începe învățarea.

</p>

<p>

La finalul fiecărei lecții poți alege:

</p>

<ul>

<li>📝 Testează-te</li>

<li>➡️ Tema următoare</li>

</ul>

</div>

`;