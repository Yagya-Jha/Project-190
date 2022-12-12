AFRAME.registerComponent("elemental",{
    schema: {
        kind: {type: 'string', default: 'fire'}
    },
    init: function(){
        let t=document.querySelector("#txt");
        let p =document.querySelector("#player");
        const { kind }=this.el.getAttribute("elemental");
        this.el.addEventListener("mouseenter", () => {
            t.setAttribute("text",{value:kind.toUpperCase()});
            p.setAttribute("player",{pickableItem: kind});
        });
        this.el.addEventListener("mouseleave", ()=>{
            t.setAttribute("text",{value:' '});
            p.setAttribute("player",{pickableItem: ' '});
        } )
    }
});