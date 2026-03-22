let currentDialogue = 0; 
let currentScene = "";

const state={
  bills: 0,
  houseBudget: 10000,
  councilBudget: 100000,
  envScore: 0,
  isQuiz: 0
};

const upgradeCatalog = [
  {
    name: "Loft insulation",
    cost: 9000,    
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Cavity wall insulation",
    cost: 14000,
    envScoreDelta: +4,
    notes: "Big savings for older stock (if suitable).",
  },
  {
    name: "Double glazing",
    cost: 22000,
    envScoreDelta: +4,
    notes: "Comfort + noise benefits.",
  },
  {
    name: "Air-source heat pump",
    cost: 120000,
    envScoreDelta: +6,
    notes: "High capex; best with insulation first.",
  },
  {
    name: "upgrade1",
    cost: 5000,
    envScoreDelta: +6,
    notes: "High capex; best with insulation first.",
  },
];


const scenes={
  councilHome1:{
    image: "./images/inside_house.webp", 
    dialogue:[ {text:"words 1",choices:[{text:"choice1", action:"tbd"}, {text:"choice2", action:"tbd"}]},
    {text: "words 2"},
    {text:"choose an upgrade",choices:[{text:"upgrade1", action:"lessUpgrade1"}, {text:"upgrade2", action:"lessUpgrade2"}]},
    {text: "words 3"}, 
    {text: "words 4", choices:[{text:"Go to council office", next:"councilOffice1"}]}],
    clickables:[{x:75, y:12, width:20, height:30, action:"to be added"}, {x:5, y:56, width:17, height:12, action:"something else"} ]
  },
    councilOffice1:{
    image: "./images/council_office.webp", 
    
    dialogue:[ {text:"words 1",choices:[{text:"choice1", action:"tbd2"}, {text:"choice2", action:"tbd"}]},
    {text: "words 2"}, 
    {text: "words 3"}, 
    {text: "words 4", choices:[{text:"Take the Quiz", next:"quiz"}]}],
    clickables:[{x:35, y:35, width:29, height:28, action:"computer brochure"} ]
  },
    councilHomeOut:{
    image: "./images/normal_house.webp", 
     dialogue:[ {text:"words 1",choices:[{text:"choice1", action:"tbd"}, {text:"choice2", action:"tbd"}]},
     {text: "words 2"}, {text: "words 3"}, 
     {text: "words 4", choices:[{text:"Go to the council office", next:"councilOffice1"}]}],
    clickables:[{x:75, y:12, width:20, height:30, action:"to be added"}, {x:5, y:56, width:17, height:12, action:"something else"} ]
  }
};



function ChangeScene(sceneName){
  document.querySelector(".nextButton").style.display = "block";
  document.getElementById("choices").style.display = "none";
  currentScene = sceneName; 
  currentDialogue = 0; 
  const scene = scenes[sceneName]
  document.getElementById("scenery").style.backgroundImage = `url(${scene.image})`;
  ShowDialogue();
  CreateClickables();
}

function ShowDialogue(){
  const scene = scenes[currentScene];
  const wordsNow = scene.dialogue[currentDialogue];

  document.getElementById("dialogue").innerText=wordsNow.text;
  document.getElementById("choices").innerHTML ="";
  if(wordsNow.choices){
    ShowChoices(wordsNow.choices);
    document.querySelector(".nextButton").style.display ="none";
  }else{document.querySelector(".nextButton").style.display ="block";}
}

function ShowChoices(choices){
  document.getElementById("choices").style.display = "block";
  const allChoices = document.getElementById("choices");
  choices.forEach(choice =>{
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.onclick = () => CheckChoiceType(choice); 
    allChoices.appendChild(button);
  });
}

function CheckChoiceType(choice){
  if(choice.next === "quiz"){
    window.location.href = "quiz.html";
    return;
  }
  if(choice.next){
    ChangeScene(choice.next);
    return;
  }
  if(choice.action){
    ChooseAction(choice.action);
    ChangeDialogue();
  }
}

function ChooseAction(action){
  if(action === "tbd"){
    Popup("another popup", "for testing1")
  }
  if(action === "tbd2"){
    Popup("another popup", "for testing2")
  }
  if(action === "lessUpgrade1"){
    ApplyUpgrade("upgrade1")
    Popup("another popup", state.councilBudget)
  }
  if(action === "lessUpgrade2"){
    Popup("another popup", "for testing2")
  }
}

function CreateClickables(){
  const scene = scenes[currentScene];
  const allClickables = document.getElementById("clickable");
  allClickables.innerHTML = "";
  if(!scene.clickables) return;
  scene.clickables.forEach(spot =>{
    const div = document.createElement("div");
    div.className = "clickHere";
    div.style.left = spot.x + "%";
    div.style.top = spot.y + "%";
    div.style.width = spot.width + "%";
    div.style.height = spot.height + "%";
    div.onclick = ()=>DoClickable(spot.action);
    allClickables.appendChild(div);

  });
}

function DoClickable(action){
  if(action === "to be added"){
    Popup("PopUp","this would be your popup");
  }
  if(action == "something else"){
    Popup("Popup2","heres another popup");
  }
  if(action == "computer brochure"){
    window.open("gov_policy.html", "_blank");
  }
}

function ChangeDialogue(){
  const scene = scenes[currentScene];
  currentDialogue++;
  if (currentDialogue<scene.dialogue.length){
    ShowDialogue();
  }else{
    document.getElementById("dialogue").innerText = " ";
  }
}

function Popup(title, content){
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupContent").innerText = content; 
  document.getElementById("popupBG").classList.add("show");
}

function ClosePopup(){
  document.getElementById("popupBG").classList.remove("show");
}

function ApplyUpgrade(upgradeName) {
  const up = upgradeCatalog.find(u => u.name === upgradeName);
  if (!up) return;
  if (state.councilBudget < up.cost) return;
  state.councilBudget -= up.cost;
  document.getElementById("councilBudget").innerHTML = "Council Budget: £"+ state.councilBudget.toLocaleString();

}

function StartGame(){
  document.getElementById("startScreen").style.display = "none"; 
  document.getElementById("game").style.display ="block";
  ChangeScene("councilHome1");
}



