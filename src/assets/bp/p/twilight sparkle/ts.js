BrowserPonies.loadConfig({"speed":3,"speakProbability":0.1,"dontSpeak":false,"volume":1,"interval":40,"fps":25,"interactionInterval":500,"audioEnabled":false,"showFps":false,"preloadAll":false,"showLoadProgress":true,"fadeDuration":500,"spawn":{"Twilight Sparkle":1},"autostart":true,"ponies":[{"baseurl":"assets/bp/p/","behaviors":[{"name":"stand","probability":0.15,"maxduration":15,"minduration":5,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"MouseOver","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":50,"y":34},"leftcenter":{"x":47,"y":34},"group":0},{"name":"walk","probability":0.2,"maxduration":15,"minduration":3,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Horizontal_Only","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"take_control_walk","probability":0,"maxduration":15,"minduration":3,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_Vertical","auto_select_images":true,"dont_repeat_animation":false,"skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"take_control_walk2","probability":0,"maxduration":15,"minduration":3,"speed":5,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_Vertical","auto_select_images":true,"dont_repeat_animation":false,"skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"warp1","probability":0.2,"maxduration":2.99,"minduration":2.99,"speed":0,"rightimage":"twilight sparkle/teleport_right.gif","leftimage":"twilight sparkle/teleport_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":true,"linked":"warp2","skip":false,"x":0,"y":0,"rightcenter":{"x":62,"y":70},"leftcenter":{"x":81,"y":70},"group":0},{"name":"warp2","probability":0.05,"maxduration":4,"minduration":1.5,"speed":8,"rightimage":"twilight sparkle/transit.gif","leftimage":"twilight sparkle/transit.gif","movement":"Diagonal_Vertical","auto_select_images":true,"dont_repeat_animation":false,"linked":"warp3","skip":true,"x":0,"y":0,"rightcenter":{"x":0,"y":0},"leftcenter":{"x":0,"y":0},"group":0},{"name":"warp3","probability":0.05,"maxduration":1.36,"minduration":1.36,"speed":0,"rightimage":"twilight sparkle/arrive_right.gif","leftimage":"twilight sparkle/arrive_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":true,"skip":true,"x":0,"y":0,"rightcenter":{"x":72,"y":72},"leftcenter":{"x":65,"y":72},"group":0},{"name":"Read","probability":0.15,"maxduration":45,"minduration":20,"speed":0,"rightimage":"twilight sparkle/read.gif","leftimage":"twilight sparkle/read.gif","movement":"Sleep","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":85,"y":26},"leftcenter":{"x":85,"y":26},"group":0},{"name":"theme 1","probability":0,"maxduration":7.5,"minduration":7.5,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"linked":"theme 2","speakend":"theme 1","skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"theme 2","probability":0,"maxduration":4,"minduration":4,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"linked":"theme 3","speakend":"theme 2","skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"theme 3","probability":0,"maxduration":8,"minduration":8,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"linked":"theme 4","speakend":"theme 3","skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"theme 4","probability":0,"maxduration":4,"minduration":4,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"linked":"theme 5","skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"theme 5","probability":0,"maxduration":3.5,"minduration":3.5,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"speakstart":"theme 4","skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":34},"leftcenter":{"x":47,"y":34},"group":0},{"name":"Galla_Dress","probability":0.01,"maxduration":20,"minduration":15,"speed":0,"rightimage":"twilight sparkle/twilight_galla_right.gif","leftimage":"twilight sparkle/twilight_galla_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":55,"y":31},"leftcenter":{"x":48,"y":31},"group":0},{"name":"baloon","probability":0.001,"maxduration":17,"minduration":10,"speed":0.5,"rightimage":"twilight sparkle/twi-balloon-right.gif","leftimage":"twilight sparkle/twi-balloon-left.gif","movement":"All","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":151,"y":400},"leftcenter":{"x":150,"y":400},"group":0},{"name":"truck_twilight","probability":0,"maxduration":3,"minduration":3,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"None","auto_select_images":false,"dont_repeat_animation":false,"linked":"truck_twilight2","speakstart":"truck1","skip":true,"x":200,"y":0,"follow":"Applejack","stopped":"stand","moving":"walk","rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"truck_twilight2","probability":0,"maxduration":7,"minduration":7,"speed":0,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"None","auto_select_images":false,"dont_repeat_animation":false,"linked":"truck_twilight3","speakstart":"truck2","skip":true,"x":0,"y":0,"follow":"Applejack","stopped":"stand","moving":"stand","rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"truck_twilight3","probability":0,"maxduration":7,"minduration":7,"speed":0,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"None","auto_select_images":false,"dont_repeat_animation":false,"speakstart":"truck3","speakend":"truck4","skip":true,"x":0,"y":0,"follow":"Applejack","stopped":"stand","moving":"stand","rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"rage","probability":0.1,"maxduration":7.3,"minduration":7.3,"speed":0,"rightimage":"twilight sparkle/twi_rage_right.gif","leftimage":"twilight sparkle/twi_rage_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":66,"y":154},"leftcenter":{"x":51,"y":154},"group":0},{"name":"gallop","probability":0.05,"maxduration":15,"minduration":15,"speed":5,"rightimage":"twilight sparkle/twilight_gallop_right.gif","leftimage":"twilight sparkle/twilight_gallop_left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":70,"y":28},"leftcenter":{"x":59,"y":28},"group":0},{"name":"breakdown","probability":0.02,"maxduration":7,"minduration":7,"speed":0,"rightimage":"twilight sparkle/breakdown_right.gif","leftimage":"twilight sparkle/breakdown_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":48,"y":38},"leftcenter":{"x":47,"y":38},"group":0},{"name":"Discorded","probability":0.01,"maxduration":3.55,"minduration":3.55,"speed":0,"rightimage":"twilight sparkle/discorded_right.gif","leftimage":"twilight sparkle/discorded_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":50,"y":32},"leftcenter":{"x":47,"y":32},"group":0},{"name":"pinkaport","probability":0,"maxduration":5.5,"minduration":5.5,"speed":0,"rightimage":"twilight sparkle/magic_twilight_right.gif","leftimage":"twilight sparkle/magic_twilight_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":true,"skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":46},"leftcenter":{"x":61,"y":46},"group":0},{"name":"Twologht","probability":0,"maxduration":10.24,"minduration":10.24,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":34},"leftcenter":{"x":47,"y":34},"group":0},{"name":"Conga Start","probability":0,"maxduration":5,"minduration":5,"speed":10,"rightimage":"twilight sparkle/twilight_gallop_right.gif","leftimage":"twilight sparkle/twilight_gallop_left.gif","movement":"Diagonal_horizontal","auto_select_images":false,"dont_repeat_animation":false,"linked":"Conga","skip":true,"x":0,"y":70,"follow":"Pinkie Pie","stopped":"stand","moving":"gallop","rightcenter":{"x":71,"y":28},"leftcenter":{"x":58,"y":28},"group":0},{"name":"Conga","probability":0,"maxduration":30,"minduration":30,"speed":1.2,"rightimage":"twilight sparkle/congatwilight_right.gif","leftimage":"twilight sparkle/congatwilight_left.gif","movement":"Horizontal_Only","auto_select_images":false,"dont_repeat_animation":false,"skip":true,"x":-42,"y":-1,"follow":"Rarity","stopped":"stand","moving":"Conga","rightcenter":{"x":47,"y":43},"leftcenter":{"x":46,"y":43},"group":0},{"name":"Drag","probability":0,"maxduration":4.1,"minduration":0,"speed":0,"rightimage":"twilight sparkle/twilightdrag_right.gif","leftimage":"twilight sparkle/twilightdrag_left.gif","movement":"Dragged","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":29,"y":52},"leftcenter":{"x":32,"y":52},"group":0},{"name":"Flowing_Mane","probability":0.1,"maxduration":8,"minduration":3,"speed":0,"rightimage":"twilight sparkle/windblown_right.gif","leftimage":"twilight sparkle/windblown_left.gif","movement":"None","auto_select_images":false,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":32,"y":42},"leftcenter":{"x":45,"y":42},"group":0},{"name":"ride-start","probability":0,"maxduration":3,"minduration":3,"speed":2,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"All","auto_select_images":false,"dont_repeat_animation":false,"linked":"ride","skip":true,"x":0,"y":0,"follow":"Owlowiscious","stopped":"stand","moving":"walk","rightcenter":{"x":50,"y":36},"leftcenter":{"x":47,"y":36},"group":0},{"name":"ride","probability":0.15,"maxduration":30,"minduration":30,"speed":3,"rightimage":"twilight sparkle/twi-owl-right.gif","leftimage":"twilight sparkle/twi-owl-left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"skip":true,"x":0,"y":0,"rightcenter":{"x":50,"y":38},"leftcenter":{"x":47,"y":38},"group":0},{"name":"crystallized","probability":0.01,"maxduration":30,"minduration":15,"speed":0,"rightimage":"twilight sparkle/crystallizedtwilight_right.png","leftimage":"twilight sparkle/crystallizedtwilight_left.png","movement":"None","effects":[{"name":"crystalspark","rightimage":"twilight sparkle/sparkle.gif","leftimage":"twilight sparkle/sparkle.gif","duration":0,"delay":0,"rightloc":"Center","rightcenter":"Center","leftloc":"Center","leftcenter":"Center","follow":true,"dont_repeat_animation":false}],"auto_select_images":false,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":50,"y":32},"leftcenter":{"x":47,"y":32},"group":0},{"name":"deal_twi","probability":0.05,"maxduration":3.7,"minduration":3.5,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":true,"skip":true,"x":0,"y":0,"follow":"Shopkeeper","rightcenter":{"x":50,"y":34},"leftcenter":{"x":47,"y":34},"group":0},{"name":"party_hard","probability":0.05,"maxduration":8,"minduration":3,"speed":0,"rightimage":"twilight sparkle/twilight_partyhard_right.gif","leftimage":"twilight sparkle/twilight_partyhard_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":50,"y":24},"leftcenter":{"x":61,"y":24},"group":0},{"name":"starswirl","probability":0.01,"maxduration":24,"minduration":8,"speed":3,"rightimage":"twilight sparkle/twi-starswirl-right.gif","leftimage":"twilight sparkle/twi-starswirl-left.gif","movement":"Diagonal_horizontal","auto_select_images":true,"dont_repeat_animation":false,"skip":false,"x":0,"y":0,"rightcenter":{"x":53,"y":76},"leftcenter":{"x":54,"y":76},"group":0},{"name":"banner start","probability":0,"maxduration":6,"minduration":6,"speed":3,"rightimage":"twilight sparkle/trotcycle_twilight_right.gif","leftimage":"twilight sparkle/twilight_trot_left.gif","movement":"Diagonal_horizontal","auto_select_images":false,"dont_repeat_animation":false,"linked":"banner fit","skip":true,"x":90,"y":5,"follow":"Carrot Top","stopped":"stand","moving":"walk","rightcenter":{"x":0,"y":0},"leftcenter":{"x":0,"y":0},"group":0},{"name":"banner fit","probability":0,"maxduration":6,"minduration":6,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"None","auto_select_images":false,"dont_repeat_animation":false,"linked":"banner again","speakstart":"banner name","skip":true,"x":89,"y":5,"follow":"Carrot Top","stopped":"stand","moving":"stand","rightcenter":{"x":0,"y":0},"leftcenter":{"x":0,"y":0},"group":0},{"name":"banner again","probability":0,"maxduration":5,"minduration":5,"speed":0,"rightimage":"twilight sparkle/stand_twilight_right.gif","leftimage":"twilight sparkle/stand_twilight_left.gif","movement":"None","auto_select_images":true,"dont_repeat_animation":false,"speakstart":"banner again","skip":true,"x":0,"y":0,"rightcenter":{"x":0,"y":0},"leftcenter":{"x":0,"y":0},"group":0}],"speeches":[{"name":"Unnamed #1","text":"Spiiiiike?","skip":false,"group":0},{"name":"Unnamed #2","text":"I should really get back to studying...","skip":false,"group":0},{"name":"Unnamed #3","text":"Cross my heart and hope to fly, stick a cupcake in my-- OW!","skip":false,"group":0},{"name":"Theme 1","text":"I used to wonder what friendship could be!","skip":true,"group":0},{"name":"Theme 2","text":"Until you all shared its magic with me!","skip":true,"group":0},{"name":"Theme 3","text":"And magic makes it all complete!","skip":true,"group":0},{"name":"Theme 4","text":"Do you know you're all my very best friends?","skip":true,"group":0},{"name":"truck1","text":"What in the hay!?","skip":true,"group":0},{"name":"Truck2","text":"Applejack, what in the wide, wide world of Equestria is THAT?","skip":true,"group":0},{"name":"Truck3","text":"And why is there a cardboard cutout of ME in the back???","skip":true,"group":0},{"name":"Truck4","text":"What? Ugh...","skip":true,"group":0},{"name":"Soundboard #1","text":"Ah, hello?","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/ah%2C%20hello.mp3","audio/ogg":"twilight sparkle/ah%2C%20hello.ogg"}},{"name":"Soundboard #2","text":"All the ponies in this town are CRAZY!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/all%20the%20ponies%20in%20this%20town%20are%20crazy.mp3","audio/ogg":"twilight sparkle/all%20the%20ponies%20in%20this%20town%20are%20crazy.ogg"}},{"name":"Soundboard #3","text":"Are you crazy?","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/are%20you%20crazy.mp3","audio/ogg":"twilight sparkle/are%20you%20crazy.ogg"}},{"name":"Soundboard #4","text":"Dear Princess Celestia...","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/dear%20princess%20celestia.mp3","audio/ogg":"twilight sparkle/dear%20princess%20celestia.ogg"}},{"name":"Soundboard #5","text":"Ooh! Doesn't that hurt?","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/doesn't%20that%20hurt.mp3","audio/ogg":"twilight sparkle/doesn't%20that%20hurt.ogg"}},{"name":"Soundboard #6","text":"We'll do everything by the book!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/do%20everything%20by%20the%20book.mp3","audio/ogg":"twilight sparkle/do%20everything%20by%20the%20book.ogg"}},{"name":"Soundboard #7","text":"Good afternoon! My name is Twilight Sparkle.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/good%20afternoon%2C%20my%20name....mp3","audio/ogg":"twilight sparkle/good%20afternoon%2C%20my%20name....ogg"}},{"name":"Soundboard #8","text":"I don't get it.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/i%20don't%20get%20it.mp3","audio/ogg":"twilight sparkle/i%20don't%20get%20it.ogg"}},{"name":"Soundboard #10","text":"I uh, I think I hear my laundry calling! Sorry, gotta go.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/i%20think%20i%20hear%20my%20laundry%20calling%2C%20sry%20gotta%20go.mp3","audio/ogg":"twilight sparkle/i%20think%20i%20hear%20my%20laundry%20calling%2C%20sry%20gotta%20go.ogg"}},{"name":"Soundboard #11","text":"It's the perfect plan!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/it's%20the%20perfect%20plan.mp3","audio/ogg":"twilight sparkle/it's%20the%20perfect%20plan.ogg"}},{"name":"Soundboard #12","text":"Look out! Here comes Tom!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/look%20out%20here%20comes%20tom.mp3","audio/ogg":"twilight sparkle/look%20out%20here%20comes%20tom.ogg"}},{"name":"Soundboard #13","text":"More?","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/more.mp3","audio/ogg":"twilight sparkle/more.ogg"}},{"name":"Soundboard #14","text":"My little ponies!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/my%20little%20ponies.mp3","audio/ogg":"twilight sparkle/my%20little%20ponies.ogg"}},{"name":"Soundboard #15","text":"No excuses!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/no%20excuses.mp3","audio/ogg":"twilight sparkle/no%20excuses.ogg"}},{"name":"Soundboard #16","text":"No, really?","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/no%20rly.mp3","audio/ogg":"twilight sparkle/no%20rly.ogg"}},{"name":"Soundboard #17","text":"Oh no! Nonononono-no-NO! This is bad!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/oh%20no%2C%20this%20is%20bad.mp3","audio/ogg":"twilight sparkle/oh%20no%2C%20this%20is%20bad.ogg"}},{"name":"Soundboard #18","text":"You told me it was all an old pony tale.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/old%20pony%20tale.mp3","audio/ogg":"twilight sparkle/old%20pony%20tale.ogg"}},{"name":"Soundboard #19","text":"Pardon me, Princess.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/pardon%20me%20princess.mp3","audio/ogg":"twilight sparkle/pardon%20me%20princess.ogg"}},{"name":"Soundboard #20","text":"Please don't hate me!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/pls%20dont%20hate%20me.mp3","audio/ogg":"twilight sparkle/pls%20dont%20hate%20me.ogg"}},{"name":"Soundboard #21","text":"Prove it.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/prove%20it.mp3","audio/ogg":"twilight sparkle/prove%20it.ogg"}},{"name":"Soundboard #22","text":"This is MY book! And I'm gonna READ IT!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/this%20is%20my%20book%20and%20im%20gonna%20read%20it.mp3","audio/ogg":"twilight sparkle/this%20is%20my%20book%20and%20im%20gonna%20read%20it.ogg"}},{"name":"Soundboard #23","text":"Ehehaha... This is no joke.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/this%20is%20no%20joke.mp3","audio/ogg":"twilight sparkle/this%20is%20no%20joke.ogg"}},{"name":"Soundboard #24","text":"Tough love, baby!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/tough%20love%2C%20baby.mp3","audio/ogg":"twilight sparkle/tough%20love%2C%20baby.ogg"}},{"name":"Soundboard #25","text":"Wow. Catchy.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/wow%20catchy.mp3","audio/ogg":"twilight sparkle/wow%20catchy.ogg"}},{"name":"Soundboard #26","text":"Yesyesyesyesyesyesyesyesyesyesyesyesyesyesyesyes!","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/yesyesyes.mp3","audio/ogg":"twilight sparkle/yesyesyes.ogg"}},{"name":"Soundboard #27","text":"Your faithful student, Twilight Sparkle.","skip":false,"group":0,"files":{"audio/mpeg;codecs=\"mp3\"":"twilight sparkle/your%20faithful%20student....mp3","audio/ogg":"twilight sparkle/your%20faithful%20student....ogg"}},{"name":"banner name","text":"What happened to the rest of her name?","skip":true,"group":0},{"name":"banner again","text":"We can't hang a banner that says 'Welcome Princess Celest'! Take it down and try again.","skip":true,"group":0}],"categories":["main ponies","mares","unicorns"],"name":"Twilight Sparkle"}]});