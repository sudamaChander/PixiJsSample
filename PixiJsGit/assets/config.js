
const app = new PIXI.Application();
await app.init({ background: '#000000',/* resizeTo: window */   width: 640, height: 860, resolution: 0.82  });
document.body.appendChild(app.canvas);



var explode = new Howl({src: ['assets/sounds/explodeSnd.mp3'], html5: true});

var shootAnim;
var explodeEff;
var boyRun;
var isLoded=false;
var isBoyGrouded=false;

//----preloader txt----------------
const loaderText = new PIXI.Text({ text: 'Please wait...' });
loaderText.style.fill = 0xffffff;
loaderText.x=app.screen.width/2;
loaderText.y=app.screen.height/2;
loaderText.anchor.set(0.5);
app.stage.addChild(loaderText);

//--------assets loader-----------------
PIXI.Assets.load([   
    'assets/sprites/newSprites/spritesheet.json',
    'https://pixijs.com/assets/spritesheet/mc.json',
     'assets/sprites/newSprites/spritesheetChar.json',
     'assets/sprites/gun.png',
 
]).then(onAssetsLoaded);

//---asset load complete----------
function onAssetsLoaded()
{   loaderText.visible=false;
    
   
    let i;
    const shootFrames = [];
    for (i = 0; i < 59; i++)
    {    
        if(i<10){        
            shootFrames.push(PIXI.Texture.from(`meteor_0${i}.png`));
        }else{            
            shootFrames.push(PIXI.Texture.from(`meteor_${i}.png`));
        }       
    }

    //---shoot clip---------------
    shootAnim = new PIXI.AnimatedSprite(shootFrames);
    shootAnim.x = 480;
    shootAnim.y = app.screen.height /2-100;
    shootAnim.anchor.set(0.5);
    shootAnim.scale.set( 0.3);
    shootAnim.animationSpeed = 1;
    shootAnim.loop=false;
    shootAnim.alpha=0;
    shootAnim.gotoAndStop(0);    
    //shootAnim.play();
    app.stage.addChild(shootAnim);

    //------gun-----------
    var gunSprite=new PIXI.Sprite(PIXI.Texture.from('assets/sprites/gun.png'));
    gunSprite.scale.set(0.3);
    gunSprite.anchor.set(0.5)
    gunSprite.x=52.5
    gunSprite.y=shootAnim.y+15
    app.stage.addChild(gunSprite);

    //--------------------------------
    const explodeFrames = [];
    for (i = 0; i < 26; i++)
    {       
        explodeFrames.push(PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`));     
    }

    //---explode clip---------------
    explodeEff = new PIXI.AnimatedSprite(explodeFrames);    
    explodeEff.x = app.screen.width-50;
    explodeEff.y = shootAnim.y;
    explodeEff.anchor.set(0.5);
    explodeEff.rotation = Math.random() * Math.PI;
    explodeEff.scale.set(0.75 + Math.random() * 0.5);   
    explodeEff.animationSpeed = 1;
    explodeEff.loop=false; 
    explodeEff.gotoAndStop(0);
    explodeEff.visible=false;
    app.stage.addChild(explodeEff);

    const boyFrames = [];
    for (i = 0; i < 12; i++)
    {    
        boyFrames.push(PIXI.Texture.from(`char${i+1}.png`));    
    }    

    //=====================================================

    const shootBtnContnr = new PIXI.Container();
    app.stage.addChild(shootBtnContnr);

    const btnGr = new PIXI.Graphics();
    btnGr.roundRect(0, 0, 300, 100, 16);
    btnGr.fill(0x650a5a);
    btnGr.stroke({ width: 2, color: 0xff00ff });

    const btnText = new PIXI.Text({ text: 'Shoot',style: { fontFamily: 'Bahus9'} });
    btnText.style.fill = 0xffffff;
    btnText.style.fontSize=45
    btnText.style.fontWeight="bold";
    btnText.x=btnGr.width/2-btnText.width/2;
    btnText.y=btnGr.height/2-btnText.height/2;;
    btnText.anchor.set(0);

    shootBtnContnr.addChild(btnGr,btnText);
    shootBtnContnr.setSize(300,100);
    shootBtnContnr.x=app.screen.width / 2-shootBtnContnr.width/2;
    shootBtnContnr.y=app.screen.height / 2-shootBtnContnr.height/2;


    //---boy run clip---------------
    boyRun = new PIXI.AnimatedSprite(boyFrames);
    boyRun.x = app.screen.width/2;
    boyRun.y = (shootBtnContnr.y-shootBtnContnr.height/2)-10;
    boyRun.anchor.set(0.5);
    boyRun.scale.set( 0.3);   
    boyRun.scale.x=-0.3;
    boyRun.animationSpeed = 0.3;
    boyRun.loop=true;
    //boyRun.alpha=0;
    boyRun.gotoAndStop(3);
    //console.log(shootAnim.width)
    //boyRun.play();
    var orgY=boyRun.y;
    app.stage.addChild(boyRun);
    boyRun.y=-80;
    BoyFall();

    //----shoot event----------
    shootBtnContnr.eventMode = 'static';
    shootBtnContnr.cursor = 'pointer';
    shootBtnContnr.on('pointerdown', onClick);

    function onClick(){
        if(isLoded && isBoyGrouded){
            btnGr.tint = 0x0000EE;            
            isBoyGrouded=false;
            shootAnim.alpha=1;
            shootAnim.gotoAndPlay(0);
            gunSprite.scale.x=0.28;   
            boyJumping();          
            ExplosionPlay();          
        }  
    }


    function BoyFall(){
        setTimeout(() => {          
            var fallTween = createjs.Tween.get(boyRun, {loop: false	}).to({	y: orgY}, 1400, createjs.Ease.backIn).call(boyWalkTweenCom);
            function boyWalkTweenCom(){
                boyRun.gotoAndPlay(3);
                isBoyGrouded=true;
            }
        }, "180");        
        
    }

    function ExplosionPlay(){
        setTimeout(() => {            
            gunSprite.scale.x=0.3;
            explodeEff.visible=true;
            explode.play();
            explodeEff.gotoAndPlay(0); 
        }, "680"); 
    }

    function boyJumping(){
        boyRun.stop();
        setTimeout(() => {
            btnGr.tint = 0xffffff;    
            var jumTween = createjs.Tween.get(boyRun, {loop: false	}).to({	y: boyRun.y-70}, 400, createjs.Ease.backOut).call(jumpTweenComplete);
            function jumpTweenComplete(){               
                isBoyGrouded=true;
                boyRun.y=orgY;
                boyRun.play();
            }
        }, "140");
    }

    
    isLoded=true;
}






