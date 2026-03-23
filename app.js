let currentDialogue = 0;
let currentScene = "";
let highBills = 300;
let lowBills = 150;

const state = {
  bills: 0,
  houseBudget: 10000,
  councilBudget: 100000,
  envScore: 0,
  isQuiz: 0,
};

const upgradeCatalog = [
  {
    name: "Loft insulation",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Floor insulation",
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
    name: "Air tightness",
    cost: 22000,
    envScoreDelta: +4,
    notes: "Comfort + noise benefits.",
  },
  {
    name: "Internal wall insulation ",
    cost: 120000,
    envScoreDelta: +6,
    notes: "High capex; best with insulation first.",
  },
  {
    name: "External wall insulation",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Ventilation",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Air source heat pump",
    cost: 5000,
    envScoreDelta: +6,
    notes: "High capex; best with insulation first.",
  },
  {
    name: "Ground source heat pump",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Heat network",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
  {
    name: "Hybrid heat heat pump",
    cost: 9000,
    envScoreDelta: +3,
    notes: "Cheapest win for heat loss.",
  },
];

const scenes = {
  councilHome1: {
    image: "./images/tenant_in_house.webp",
    dialogue: [
      {
        text: "This house is always so cold during winter....",
        speaker: "Council Tenant",
      },
      {
        text: "But the heating prices have been really high lately. I dont know if I can afford to turn the heating up anymore.",
        speaker: "Council Tenant",
      },
      {
        text: "Should I really turn the heating up?",
        speaker: "Council Tenant",
        choices: [
          { text: "Turn up the heating and get warm", action: "getWarm" },
          { text: "Leave the heating and stay cold", action: "stayCold" },
        ],
      },
      { text: "ONE MONTH LATER", speaker: "" },
      {
        text: "I wonder what's in the post today...",
        speaker: "Council Tenant",
        choices: [{ text: "Check the post", next: "highBills" }],
      },
    ],
  },
  highBills: {
    image: "./images/high_bills.webp",
    dialogue: [
      { text: "How could this bill be so high!?", speaker: "Council Tenant" },
      {
        text: "How are we supposed to heat this house and still afford to eat.",
        speaker: "Council Tenant",
      },
      {
        text: "If we didn't cut our food expenses this month, we would never be able to afford this gas bill.",
        speaker: "Council Tenant",
        choices: [{ text: "Pay the bill", action: "Pay bill" }],
      },
      {
        text: "I don't understand how they expect us to keep living like this",
        speaker: "Council Tenant",
        choices: [{ text: "Next Letter", next: "councilBrochure" }],
      },
    ],
  },
  lowBills: {
    image: "./images/low_bills.webp",
    dialogue: [
      {
        text: "The entire family has been freezing inside this house all month.",
        speaker: "Council Tenant",
      },
      {
        text: "But at least now we can afford our gas bill and still put some food on the table.",
        speaker: "Council Tenant",
        choices: [{ text: "Pay the bill", action: "Pay bill" }],
      },
      {
        text: "I don't understand how they expect us to keep living like this",
        speaker: "Council Tenant",
        choices: [{ text: "Next Letter", next: "councilBrochure" }],
      },
    ],
  },
  councilBrochure: {
    image: "./images/decarbonising_brochure.webp",
    dialogue: [
      { text: "Oh... this one is from the council", speaker: "Council Tenant" },
      {
        text: "It's about decarbonising our house.",
        speaker: "Council Tenant",
      },
      {
        text: "I can barely afford to keep the heating on now! Won't this just make things worse?",
        speaker: "Council Tenant",
      },
      {
        text: "Maybe I should give them a call...",
        speaker: "Council Tenant",
        choices: [
          { text: "Call the council", action: "called" },
          { text: "Don't call the council", action: "notCalled" },
        ],
      },
      {
        text: "What does the council even do!?",
        speaker: "Council Tenant",
        choices: [{ text: "Play as the Council", next: "councilOffice1" }],
      },
    ],
  },
  councilOffice1: {
    image: "./images/council_office.webp",
    dialogue: [
      { text: "TWO MONTHS EARLIER", speaker: "" },
      {
        text: "It's about to be a busy month at work.",
        speaker: "Council Worker",
      },
      {
        text: "It's that time again where the government policies have been reviewed and the funding reassessed.",
        speaker: "Council Worker",
      },
      {
        text: "*sigh* I wonder how the change will affect us this time.",
        speaker: "Council Worker",
        choices: [{ text: "*PING*", next: "councilOffice2" }],
      },
    ],
  },
  councilOffice2: {
    image: "./images/council_office_notify.webp",
    dialogue: [
      { text: "Oh! Theres a new notification!", speaker: "Council Worker" },
      {
        text: "That might be an announcement of the new policy.",
        speaker: "Council Worker",
      },
      {
        text: "reading.....reading.....reading....reading",
        speaker: "Council Worker",
      },
      {
        text: "It seems they've now changed the 'Social Housing Decarbonisation Fund' to the 'Warm Homes: Social Housing Fund'.",
        speaker: "Council Worker",
      },
      {
        text: "They also confirmed an available fund of £1.29 billion for local authorities, housing associations and other housing providers to carry out retrofitting, focused on 'fabric first' approaches.",
        speaker: "Council Worker",
      },
      {
        text: "To qualify the properties must be below EPC C rating with exceptions made if approved low carbon heating methods are being installed.",
        speaker: "Council Worker",
      },
      {
        text: "It also says funding request amounts won't be guaranteed if the scheme is oversubscribed. ",
        speaker: "Council Worker",
      },
      {
        text: "If that's the case, we should start assessing our properties and creating upgrade plans.",
        speaker: "Council Worker",
      },
      {
        text: "The sooner we submit our bid for funding the better!",
        speaker: "Council Worker",
        choices: [{ text: "Back to present day", next: "councilOffice3" }],
      },
    ],
    clickables: [
      { x: 35, y: 35, width: 29, height: 28, action: "computer brochure" },
    ],
  },
  councilOffice3: {
    image: "./images/council_office.webp",
    dialogue: [
      { text: "PRESENT DAY", speaker: "" },
      {
        text: "Now that we've started promoting our decarbonisation efforts, I should try directly contacting our tenants to assess their EPC rating and eligibility.",
        speaker: "Council Worker",
        choices: [{ text: "Call Tenants", next: "councilCall1" }],
      },
    ],
  },
  councilCall1: {
    image: "./images/tenant_council_call.webp",
    dialogue: [
      {
        text: "Hello council tenant, this is council worker calling from your local council about potentially upgrading the heating in your home as part of our decarbonisation efforts.",
        speaker: "Council Worker",
      },
      {
        text: "Yes, hello council worker. I saw your brochure but I'm confused about what these decarbonisation efforts would mean for me.",
        speaker: "Council Tenant",
      },
      {
        text: "Well, decarbonising council housing doesnt have a one size fits all solution.",
        speaker: "Council Worker",
      },
      {
        text: "so before I can give you any specific information, we would need to have an independent assessor attend to your home.",
        speaker: "Council Worker",
      },
      {
        text: "This wouldn't require much from you, we would just need to access the property for approximately an hour, and the assesor would have a look at the structure and materials of your house",
        speaker: "Council Worker",
      },
      {
        text: "Once that assesment has been done, we can discuss more specifics and moving forward once you are comfortable.",
        speaker: "Council Worker",
      },
      {
        text: "I don't know about all these changes, but if you come when no one is around and don't get in the way, I'll let you and your contractor come see the property",
        speaker: "Council Tenant",
        choices: [
          {
            text: "Visit the property with an Independent Assessor",
            next: "outsideHome",
          },
        ],
      },
    ],
  },
  outsideHome: {
    image: "./images/normal_house.webp",
    dialogue: [
      { text: "TWO WEEKS LATER", speaker: "" },
      {
        text: "We've had to visit and assess a lot of homes this past two weeks, but this should be the last of the homes under the council that might qualify.",
        speaker: "Council Worker",
      },
      {
        text: "Hopefully, this person will be more friendly than the last few.",
        speaker: "Unnamed Independent Assessor",
      },
      {
        text: "That shouldn't be an issue, they chose to have us come by while they weren't home.",
        speaker: "Council Worker",
      },
      {
        text: "That's a good thing too, they didn't seem too receptive when I contacted them.",
        speaker: "Council Worker",
      },
      {
        text: "Should we head inside and look around now?",
        speaker: "Council Worker",
        choices: [{ text: "Lets Go!", next: "councilHome2" }],
      },
    ],
  },
  councilHome2: {
    image: "./images/council_in_house.webp",
    dialogue: [
      {
        text: "Do you want to start having a look around and I will note down your assesments?",
        speaker: "Council Worker",
      },
      {
        text: "Yes, I'll go poke around the house.",
        speaker: "Unnamed Independent Assessor",
      },
      {
        text: "Have you finished exploring the property?",
        speaker: "",
        choices: [
          { text: "Yes, lets move on", next: "councilOffice4" },
          { text: "No,not yet", action: "nothing", stay: true },
        ],
      },
    ],
    clickables: [
      { x: 75, y: 12, width: 20, height: 30, action: "window" },
      { x: 2, y: 10, width: 10, height: 40, action: "wall" },
      { x: 37, y: 90, width: 60, height: 10, action: "floor" },
      { x: 40, y: 0, width: 30, height: 10, action: "loft" },
    ],
  },
  councilOffice4: {
    image: "./images/council_office.webp",
    dialogue: [
      { text: "TWO DAYS LATER", speaker: "" },
      {
        text: "The EPC rating for the council tenant property has now been confirmed as a EPC D rating.",
        speaker: "",
      },
      {
        text: "Now that it qualifies for the scheme, let's decide on the decarbonisation plan for council tenant's property.",
        speaker: "Council Worker",
      },
      {
        text: "Should we first focus on upgrading the materials making up the buildings fabric?",
        speaker: "",
        choices: [
          { text: "Let's do 'Fabric First'", action: "fabricYes" },
          { text: "Too expensive, just fix the heating", action: "fabricNo" },
          { text: "Learn More", action: "fabricMore", stay: true },
        ],
      },
      {
        text: "Select yes or no for each of the following 'fabric first' upgrades. Extra information about each upgrade is available by choosing Learn More",
        speaker: "",
      },
      {
        text: "Loft Insulation?",
        speaker: "",
        choices: [
          { text: "Install Loft Insulation", action: "loftYes" },
          { text: "Reject Loft Insulation", action: "nothing" },
          { text: "Learn More", action: "loftMore", stay: true },
        ],
      },
      {
        text: "Floor Insulation?",
        speaker: "",
        choices: [
          { text: "Install Floor Insulation", action: "floorYes" },
          { text: "Reject Floor Insulation", action: "nothing" },
          { text: "Learn More", action: "floorMore", stay: true },
        ],
      },
      {
        text: "Cavity Wall Insulation?",
        speaker: "",
        choices: [
          { text: "Install Cavity Wall Insulation", action: "cwYes" },
          { text: "Reject Cavity Wall Insulation", action: "cwNo" },
          { text: "Learn More", action: "cwMore", stay: true },
        ],
      },
      {
        text: "Improve Air Tightness?",
        speaker: "",
        choices: [
          { text: "Yes Improve it", action: "atYes" },
          { text: "Leave It As Is", action: "nothing" },
          { text: "Learn More", action: "atMore", stay: true },
        ],
      },
      {
        text: "Add Internal or External Wall Insulation?",
        speaker: "",
        choices: [
          { text: "Install Internal Wall Insulation", action: "intYes" },
          { text: "Install External Wall Insulation", action: "extYes" },
          { text: "Skip Both Upgrades", action: "nothing" },
          { text: "Learn More", action: "int_extMore", stay: true },
        ],
      },
      {
        text: "Include Ventilation?",
        speaker: "",
        choices: [
          { text: "Yes Improve Ventilation", action: "ventYes" },
          { text: "Leave Ventilation As Is", action: "nothing" },
          { text: "Learn More", action: "ventMore", stay: true },
        ],
      },
      {
        text: "What about upgrading the heating?",
        speaker: "",
        choices: [
          { text: "Let's do some heating upgrades", action: "nothing" },
          { text: "Leave the Heating", next: "quiz" },
          { text: "Learn More", action: "heatMore", stay: true },
        ],
      },
      {
        text: "What heating upgrade should be done?",
        speaker: "",
        choices: [
          { text: "Air Source Heat Pumps", action: "airYes" },
          { text: "Ground Source Heat Pumps", action: "groundYes" },
          { text: "Connection To A Heat Network", action: "hnYes" },
          { text: "Hybrid Heat Pump System", action: "hybYes" },
          { text: "Learn More", action: "upgMore", stay: true },
        ],
      },
      {
        text: "Now that a plan has been made, it's time to submit a bid for funding to The Department for Energy Security and Net Zero (DESNZ).",
        speaker: "",
      },
      {
        text: "...I really hope we get enough funding to cover our entire plan.",
        speaker: "",
        choices: [{ text: "Submit a Bid", action: "checkBid" }],
      },
      {
        text: "Unfortunately, we didn't get our total requested amount. But as the council we have an additional £50,000. Should we supplement the grant?",
        speaker: "",
        choices: [
          { text: "Supplement the Grant", action: "supplement" },
          { text: "Scrap The Project", action: "scrap" },
        ],
      },
      {
        text: "Now let's contact the tenant again to get consent to install these upgrades.",
        speaker: "",
        choices: [{ text: "Call Tenant", next: "councilCall2" }],
      },
    ],
  },
  councilCall2: {
    image: "./images/tenant_council_call.webp",
    dialogue: [
      {
        text: "Hello council tenant, this is council worker calling from your local council as a follow up to our recent visit assessing your home.",
        speaker: "Council Worker",
      },
      { text: "Oh yes, Hello council worker", speaker: "Council Tenant" },
      {
        text: "After our visit to your home, we found your house had an EPC rating of D which means it is below the desired energy efficiency level.",
        speaker: "Council Worker",
      },
      {
        text: "This means that your house hasn't been efficiently using energy, particularly with your heating.",
        speaker: "Council Worker",
      },
      {
        text: "So you may have noticed it's been hard to keep your home warm, resulting in higher heating bills.",
        speaker: "Council Worker",
      },
      {
        text: "Our plan would be to cover and facilitate some upgrades to your home to improve its energy efficiency. Would you consent to the upgrades being carried out, council tenant?",
        speaker: "Council Worker",
      },
      {
        text: "Would I be paying for these upgrades?",
        speaker: "Council Tenant",
      },
      {
        text: "No, we would cover all the upgrades to progress towards the governmental policy goals.",
        speaker: "Council Worker",
      },
      {
        text: "However, the upgrade will be quite invasive and for a considerable span of time there will be many contractors needing access to your home.",
        speaker: "Council Worker",
      },
      {
        text: "I know this does not sound appealing in the short term, but after the upgrades are complete your home will be warmer for less.",
        speaker: "Council Worker",
      },
      {
        text: "You will also be doing your part in fighting against global warming!",
        speaker: "Council Worker",
      },
      {
        text: "I told you the first time you called! I dont care about all your 'upgrades'. *CLICK*",
        speaker: "Council Tenant",
        choices: [{ text: "Convince The Tenant", next: "quiz" }],
      },
    ],
  },
  goodEnd: {
    image: "./images/vibrant_house.webp",
    dialogue: [
      { text: "ONE YEAR LATER", speaker: "" },
      {
        text: "The upgrades took a long period of time, between locating qualified workers, relevant materials and aligning schedules for the upgrades.",
        speaker: "",
      },
      {
        text: "But now that they are complete, the council tenant family worry a lot less about keeping the heating on.",
        speaker: "",
      },
      {
        text: "Nearly all the other properties managed by the local council had successful upgrades as well.",
        speaker: "",
      },
      {
        text: "And now the environment, wildlife and future generations are better for it....",
        speaker: "",
      },
      {
        text: ":) Thank You for Playing! :)",
        speaker: "",
        choices: [{ text: "Replay", action: "replay" }],
      },
    ],
  },
  badEnd: {
    image: "./images/gloomy_house.webp",
    dialogue: [
      { text: "FIVE MONTHS LATER", speaker: "" },
      {
        text: "The local council's decarbonisation efforts were met with obstacles at every turn.",
        speaker: "",
      },
      {
        text: "Of their many council homes, they were only able to carry out successful retrofitting for approximately 5% of them.",
        speaker: "",
      },
      { text: "And now the environment is suffering.", speaker: "" },
      {
        text: "When trying to implement decarbonisation strategies, there are many obstacles that can be faced.",
        choices: [
          { text: "choice1", action: "tbd2" },
          { text: "choice2", action: "tbd" },
        ],
      },
      {
        text: "There are unreceptive tenants, budget limitations, material scarcity and shortages in trained professionals.",
      },
      {
        text: "This game offered a small scale perspective of the process of decarbonising social housing.",
        speaker: "",
      },
      {
        text: "However, with UK Social Housing contributing approximately 10% of the UK residential sector's total carbon emissions, the decarbonisation of social housing cannot be ignored",
        speaker: "",
      },
      {
        text: "GAME OVER",
        speaker: "",
        choices: [{ text: "Replay", action: "replay" }],
      },
    ],
  },
};

function ChangeScene(sceneName) {
  document.querySelector(".nextButton").style.display = "block";
  document.getElementById("choices").style.display = "none";
  currentScene = sceneName;
  currentDialogue = 0;
  const scene = scenes[sceneName];
  document.getElementById("scenery").style.backgroundImage =
    `url(${scene.image})`;
  ShowDialogue();
  CreateClickables();
}

function ShowDialogue() {
  const scene = scenes[currentScene];
  const wordsNow = scene.dialogue[currentDialogue];

  document.getElementById("dialogue").innerText = wordsNow.text;
  document.getElementById("speaker").innerText = wordsNow.speaker;
  document.getElementById("choices").innerHTML = "";
  if (wordsNow.choices) {
    ShowChoices(wordsNow.choices);
    document.querySelector(".nextButton").style.display = "none";
  } else {
    document.querySelector(".nextButton").style.display = "block";
  }
}

function ShowChoices(choices) {
  document.getElementById("choices").style.display = "block";
  const allChoices = document.getElementById("choices");
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.onclick = () => CheckChoiceType(choice);
    allChoices.appendChild(button);
  });
}

function CheckChoiceType(choice) {
  if (choice.next === "quiz") {
    window.open("quiz.html", "_blank").focus();
    ChangeScene("goodEnd");
    return;
  }
  if (choice.next) {
    ChangeScene(choice.next);
    return;
  }
  if (choice.action) {
    ChooseAction(choice.action);
    const staying = choice.stay ?? false;
    if (!staying) {
      ChangeDialogue();
    }
  }
}

function ChooseAction(action) {
  let temp1;
  let temp2;
  let temp3;
  if (action === "getWarm") {
    temp1 = scenes.councilHome1.dialogue.find(
      (c) => c.text === "I wonder what's in the post today...",
    );
    temp2 = temp1.choices.find((c) => c.text === "Check the post");
    temp2.next = "highBills";
    state.bills = highBills;
  }
  if (action === "stayCold") {
    temp1 = scenes.councilHome1.dialogue.find(
      (c) => c.text === "I wonder what's in the post today...",
    );
    temp2 = temp1.choices.find((c) => c.text === "Check the post");
    temp2.next = "lowBills";
    state.bills = lowBills;
  }
  if (action === "called") {
    temp1 = scenes.councilOffice3.dialogue.find(
      (c) =>
        c.text ===
        "Now that we've started promoting our decarbonisation efforts, I should try directly contacting our tenants to assess their EPC rating and eligibility.",
    );
    temp1.text = "*ring*....*ring*....*ring*";
    temp1.choices[0].text = "Answer The Phone";
    scenes.councilCall1.dialogue[0].text =
      "Thank you for calling us council tenant.";
    scenes.councilCall1.dialogue[scenes.councilCall1.dialogue.length - 1].text =
      "Ok, then I'll make some time for you and your contractor to stop by!";
    temp2 = scenes.outsideHome.dialogue.find(
      (c) =>
        c.text ===
        "That's a good thing too, they didn't seem too receptive when I contacted them.",
    );
    temp2.text =
      "It's a shame though, they seemed like they would be very interested in the decarbonisation efforts.";
  }
  if (action === "notCalled") {
    state.isQuiz = 1;
  }
  if (action === "Pay bill") {
    state.houseBudget -= state.bills;
    document.getElementById("houseBudget").innerHTML =
      "Household Budget: £" + state.houseBudget.toLocaleString();
  }
  if (action === "fabricNo") {
    currentDialogue += 7;
  }
  if (action === "fabricMore") {
    Popup(
      "About 'Fabric First' Approach",
      "The 'fabric first' method refers to the approach of first upgrading the 'envelope' of a building for thermal efficiency before heating upgrades.",
    );
  }
  if (action === "loftYes") {
    ApplyUpgrade("Loft insulation");
  }
  if (action === "loftMore") {
    Popup(
      "About Loft Insulation",
      "This adds a barrier to reduce heat transfer from the roof/attic. The most common material for loft insulation in UK council housing is mineral wool. Other alternatives are: foam boards, fibreglass and natural fibres. The UK's regulations have a recommended minimum thickness of 27cm of mineral wool. Depending on the method this is a simple process.",
    );
  }
  if (action === "floorYes") {
    ApplyUpgrade("Floor insulation");
  }
  if (action === "floorMore") {
    Popup(
      "About Floor Insulation",
      "This involves adding insulating materials under/inside the structure to reduce draughts and heat loss. Common materials for this purpose are mineral wool and rigid foam.",
    );
  }
  if (action === "cwYes") {
    ApplyUpgrade("Cavity wall insulation");
  }
  if (action === "cwMore") {
    Popup(
      "About Cavity Wall Insulation",
      "This type of insulation involves filling (normally through injection) the gap between the inner and outer wall layers with insulation material. Common materials used are: mineral wool, polystyrene beads and expanding foam. Some walls are completely solid, and therefore incompatible with this type of upgrade.",
    );
  }
  if (action === "atYes") {
    ApplyUpgrade("Air tightness");
  }
  if (action === "atMore") {
    Popup(
      "About Air Tightness",
      "This upgrade has to do with reducing uncontrolled air leakage and draughts. This is done via double-glazing and gap/crack sealing upgrades to windows, doors, pipes/cables and hatches.",
    );
  }
  if (action === "intYes") {
    ApplyUpgrade("Internal wall insulation");
  }
  if (action === "int_extMore") {
    Popup(
      "About Internal and External Wall Insulation",
      "Internal and external insulation involve adding a thermal layer to the inside and outside respectively of a building's external walls. These types of insulation are employed for solid wall buildings. External wall insulation is the most effective and prefered method. However, in the case of conserving the original building and or spacial limitations, internal wall insulation is chosen instead.",
    );
  }
  if (action === "extYes") {
    ApplyUpgrade("External wall insulation");
  }
  if (action === "ventYes") {
    ApplyUpgrade("Ventilation");
  }
  if (action === "ventMore") {
    Popup(
      "About Ventilation Upgrade",
      "When retrofitting a home, the improved air tightness will often result in the creation of an environment that promotes a build up of moist and stale air. This can result in issues like poor air quality, condensation, damp and mould. Therefore, It is important to pair retrofitting efforts with good in home ventilation to prevent this.",
    );
  }
  if (action === "heatMore") {
    Popup("About Heating Upgrades", "heres another popup");
  }
  if (action === "airYes") {
    ApplyUpgrade("Air source heat pump");
  }
  if (action === "groundYes") {
    ApplyUpgrade("Ground source heat pump");
  }
  if (action === "hnYes") {
    ApplyUpgrade("Heat network");
  }
  if (action === "hybYes") {
    ApplyUpgrade("Hybrid heat pump");
  }
  if (action === "upgMore") {
    Popup("About Heating Upgrade Options", "heres another popup");
  }
  if (action === "upgMore") {
    return;
  }
}

function CreateClickables() {
  const scene = scenes[currentScene];
  const allClickables = document.getElementById("clickable");
  allClickables.innerHTML = "";
  if (!scene.clickables) return;
  scene.clickables.forEach((spot) => {
    const div = document.createElement("div");
    div.className = "clickHere";
    div.style.left = spot.x + "%";
    div.style.top = spot.y + "%";
    div.style.width = spot.width + "%";
    div.style.height = spot.height + "%";
    div.onclick = () => DoClickable(spot.action);
    allClickables.appendChild(div);
  });
}

function DoClickable(action) {
  if (action === "loft") {
    Popup(
      "The Loft",
      "Did you know an uninsulated home loses 25% of it's heat via the roof!",
    );
  }
  if (action == "floor") {
    Popup(
      "The Floors",
      "Did you know depending on the flooring up to 20% of heat loss can be due to flooring! This is particularly true for homes built before 1980 with suspended timber floors.",
    );
  }
  if (action === "wall") {
    Popup(
      "Walls With Cavities",
      "Did you know walls with cavities in an uninsulated home account for 30% of heat loss! If a home was built after the 1920s it is likely to have a cavity with no insulation whilst those after the 1990s likely have already been insulated. Another trick to tell if a wall is a cavity wall is using a lengthways brick pattern as an indicator.",
    );
  }
  if (action === "window") {
    Popup(
      "The Windows",
      "Did you know poorly insulated windows can account for 10-30% of the total heating loss in a home! ",
    );
  }
  if (action == "computer brochure") {
    window.open("gov_policy.html", "_blank");
  }
}

function ChangeDialogue() {
  const scene = scenes[currentScene];
  currentDialogue++;
  if (currentDialogue < scene.dialogue.length) {
    ShowDialogue();
  } else {
    document.getElementById("dialogue").innerText = " ";
  }
}

function Popup(title, content) {
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupContent").innerText = content;
  document.getElementById("popupBG").classList.add("show");
}

function ClosePopup() {
  document.getElementById("popupBG").classList.remove("show");
}

function ApplyUpgrade(upgradeName) {
  const up = upgradeCatalog.find((u) => u.name === upgradeName);
  if (!up) return;
  //if (state.councilBudget < up.cost) return;
  state.councilBudget -= up.cost;
  state.envScore += up.envScoreDelta;
  document.getElementById("councilBudget").innerHTML =
    "Council Budget: £" + state.councilBudget.toLocaleString();
}

function StartGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("game").style.display = "block";
  ChangeScene("councilHome1");
}
