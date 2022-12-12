let rules={
            "stone": ["fire","electricity"],
            "fire":["electricity", "wind"],
            "water":["stone","fire"],
            "wind":["stone","water"],
            "electricity":["water","wind"]
};

let player_score=0;
let enemy_score=0;

AFRAME.registerComponent("player",{
    schema: {
        pickableItem: {type: 'string', default: ' '},
        inventory: {type:'array', default: []},
    },
    init: function(){
        let add=true
        let canAdd=true;
        window.addEventListener("mousedown", (e)=>{
            let doOnce=true;
            if(e.button==0 && add && canAdd){
                let { pickableItem, inventory }=this.el.getAttribute("player");
                if(pickableItem!=' '){
                    add=false;
                    inventory.push(pickableItem);
                    this.onCollect(pickableItem);
                    this.el.setAttribute("player", {inventory: inventory});
                    if(inventory.length==5){
                        canAdd=false;
                        if(doOnce){
                            this.change();
                            this.show();
                            doOnce=false;
                        }
                    }
                }
            }
        });
        
        window.addEventListener("mouseup", (e)=>{
            if(e.button==0){
                add=true;
            }
        });


    },
    onCollect: function(x){
        for(var i=1;i<=5;i++){
            let spot=document.querySelector(`#icon_${i}`);
            if(spot.getAttribute("src")=='#empty'){
                spot.setAttribute("src", `#${x}`)
                break;
            }
        }
    },
    
    change: function(){
        const scene=document.querySelector("#scene");
        let t=document.querySelector("#fight")

        for(let i=0; i<10; i++){
            let e=document.querySelector(`#elem_${i}`);
            scene.removeChild(e);
        }

        let b= document.querySelector("#black");
        b.setAttribute("animation", {property: 'opacity',from:0,to:1,easing:'linear',loop:false,dur:1000});

        t.setAttribute("visible", true);
    },

    show: function(){
        let d=false;
        window.addEventListener("keydown", (e)=>{
            if(e.key=="z"){
                if(!d){
                    let t=document.querySelector("#fight")
                    t.setAttribute("visible", false);
                    this.createEnemy();
                    this.el.setAttribute("wasd-controls",{acceleration: 0});
                    this.el.setAttribute("position",{x: 0,y: 1,z: 23});
                    let b= document.querySelector("#black");
                    b.setAttribute("animation", {property: 'opacity',from:1,to:0,easing:'linear',loop:false,dur:1000});
                    d=true;
                    let { inventory } = this.el.getAttribute("player");
                    this.el.setAttribute("player-fight",{inventory: inventory});
                    document.querySelector("#player_score").setAttribute("visible",true);
                    document.querySelector("#enemy_score").setAttribute("visible",true);
                    this.el.removeAttribute("player");
                }
            }
        });
    },
    createEnemy: function(){
        const scene=document.querySelector("#scene");
        let elm=document.createElement("a-entity");
        elm.setAttribute("gltf-model", "#monster_model");
        elm.setAttribute("id","monster");
        elm.setAttribute("scale",{x:0.3,y:0.3,z:0.3});
        elm.setAttribute("enemy",{});
        let y = 4;
        let x=0;
        let z=15;
        elm.setAttribute("position",{x:x,y:y,z:z});
        let t=y+0.75;
        let f=y-0.25;
        elm.setAttribute("animation", {property: 'position', from: `${x} ${t} ${z}`, to: `${x} ${f} ${z}`,dir:'alternate',easing: 'easeInOutSine', loop: true, dur: 1000});
        elm.setAttribute("animation__2", {property: 'rotation', from: "10 0 -5", to: "15 0 5",dir:'alternate',easing: 'easeInOutSine', loop: true, dur: 2000});
        scene.appendChild(elm);
    },
});


AFRAME.registerComponent("player-fight",{
    schema: {inventory:{type:"array",default:[]},chances: {type:"int", default:0}},
    init: function(){
        window.addEventListener("keydown",(e)=>{
            if(e.key=="1"){
                this.fight(1)
            }else{
                if(e.key=="2"){
                    this.fight(2)
                }else{
                    if(e.key=="3"){
                        this.fight(3)
                    }else{
                        if(e.key=="4"){
                            this.fight(4)
                        }else{
                            if(e.key=="5"){
                                this.fight(5)
                            }
                        }
                    }  
                }
            }
        })
    },
    fight: function(p){
        let { inventory } = this.el.getAttribute("player-fight");
        let { weapon } = document.querySelector("#monster").getAttribute("enemy");

        p_s = document.querySelector("#player_score")
        e_s = document.querySelector("#enemy_score")
        let i=p-1;
        if(inventory[i]){
            let power=inventory[i];
            document.querySelector(`#icon_${p}`).setAttribute("src","#empty");
            inventory[i]=null;
            this.el.setAttribute("player-fight",{inventory: inventory});
            
            let rand = Math.round(Math.random()*(weapon.length-1));
            let power_e = weapon[rand];


            if(power_e==power){
                player_score++;
                p_s.setAttribute("text",{value: player_score});
                enemy_score++;
                e_s.setAttribute("text",{value: enemy_score});

            }else{
                let r=rules[power];
                if(r[0]==power_e || r[1]==power_e){
                    player_score++;
                    p_s.setAttribute("text",{value: player_score});
                }else{
                    enemy_score++;
                    e_s.setAttribute("text",{value: enemy_score});
                }
            }

            let { chances } = this.el.getAttribute("player-fight");
            chances++;
            this.el.setAttribute("player-fight",{chances: chances});
            let win=" ";
            if(chances>=5){
                if(player_score==enemy_score){
                    win="Tied The Game"
                }else{
                    win=player_score>enemy_score?"Win":"Loose";
                }
                document.querySelector("#black").setAttribute("animation", {property: 'opacity', from: 0, to: 1, easing: 'linear', loop:false,dur:1250})
                document.querySelector("#GO").setAttribute("Visible",true);
                document.querySelector("#winner").setAttribute("text", {value: `You ${win}`});
                document.querySelector("#winner").setAttribute("visible", true);

                this.el.removeAttribute("player-fight");
            }
        }
    }
});