require=function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){"use strict";class loader_class{constructor(viewer){var self=this;self.viewer=viewer;self.load_ready=false}load(){var self=this;if(self.viewer.args.origin=="local"||self.viewer.args.origin=="interactome3d"){self.viewer.message_manager.show_message("FILE");var ext="pdb";if(self.viewer.args.pdb_list[1]&&self.viewer.args.pdb_list[1].includes("cif")){ext="cif"}var pdb_url=null;if(self.viewer.args.origin=="local"){pdb_url="/upload/"+self.viewer.args.pdb_list[0]+"/"+self.viewer.args.pdb_list[1]}else if(self.viewer.args.origin=="interactome3d"){pdb_url=self.viewer.args.pdb_list[0]}self.viewer.stage.loadFile(pdb_url,{ext:ext}).then(function(i){self.initLocalStructure(self,i)}).catch(function(e){console.error(e);swal({title:"ERROR LOADING "+pdb_url+" FILE",text:"FILE FORMAT ERROR",timer:5e3,type:"error",showConfirmButton:true})})}else{var n=1;self.viewer.args.pdb_list.forEach(function(pdb_code){self.pdb_flag=true;if(n==self.viewer.args.pdb_list.length)self.load_ready=true;self.viewer.message_manager.show_message(pdb_code.toUpperCase());var url_file=location.protocol+"//mmtf.rcsb.org/v1.0/full/"+pdb_code.toUpperCase();console.log("LOADING "+url_file);self.viewer.stage.loadFile(url_file,{ext:"mmtf",firstModelOnly:true}).then(function(i){self.initStructure(self,i)}).catch(function(e){console.error(e);var url_file="rcsb://"+pdb_code.toUpperCase()+".cif";console.log("LOADING "+url_file);self.viewer.stage.loadFile(url_file,{ext:"cif",firstModelOnly:true}).then(function(i){self.initStructure(self,i)})});n++})}if(self.viewer.args.emdb){var __emdb=self.viewer.args.emdb.replace("EMD-","emd_");self.viewer.message_manager.show_em_message(self.viewer.args.emdb);var url_map=location.protocol+"//www.ebi.ac.uk/pdbe/static/files/em/maps/"+__emdb+".map.gz";self.viewer.stage.loadFile(url_map,{useWorker:true}).then(function(i){self.init_map(self,i)}).catch(function(e){console.error(e)})}if(self.viewer.args.pdb_list.length==0)self.trigger_alignment()}initLocalStructure(self,ngl,no_trigger_flag){self.init(ngl,true,false,true);if(!no_trigger_flag)self.trigger_alignment();self.viewer.message_manager.clear_message()}initStructure(self,ngl){self.init(ngl,false,true);if(self.load_ready){self.trigger_alignment();self.viewer.message_manager.clear_message()}}initChain(self,ngl){self.init(ngl,true,false);self.viewer.message_manager.clear_message()}trigger_alignment(){var self=this;setTimeout(function(){var d=JSON.parse(window.top.$j("#alignment > option:nth-child(2)").val());if("uniprot"in d){window.top.$j("#alignment > option:nth-child(2)").prop("selected",true);window.top.$j("#alignment").trigger("change")}else{console.log("No SIFT alignment available")}},1e3)}init(ngl,cartoon_visibility,trace_visibility,local_flag){var self=this;var name=ngl.name.substring(0,4).toLowerCase();if(local_flag)name=ngl.name;self.model=0;self.viewer.Structures[name]={obj:ngl,representations:{selection:{},keep_selection:{}}};var model_flag="";if(local_flag)model_flag="/0 and ";if(top.no_aa_ch&&Object.keys(top.no_aa_ch).length>0){var no_aa=":"+Object.keys(top.no_aa_ch).join(" or :");var repr=ngl.addRepresentation("ball+stick",{sele:model_flag+"( hetero or ("+no_aa+")  ) and not water and not (dna or rna) and ",visible:true});self.viewer.Structures[name]["representations"]["hetero"]=repr}else{var repr=ngl.addRepresentation("ball+stick",{sele:model_flag+"hetero and not water",visible:true});self.viewer.Structures[name]["representations"]["hetero"]=repr}var repr=ngl.addRepresentation("trace",{sele:model_flag+"dna or rna",visible:true,color:"orange"});self.viewer.Structures[name]["representations"]["nucleic"]=repr;self.viewer.Structures[name]["representations"]["chains"]={};ngl.structure.eachChain(function(ch){if(!(ch.chainname in self.viewer.Structures[name]["representations"]["chains"])){self.viewer.Structures[name]["representations"]["chains"][ch.chainname]={};var repr=ngl.addRepresentation("cartoon",{visible:cartoon_visibility,color:self.viewer.default_color,sele:model_flag+"protein and :"+ch.chainname});self.viewer.Structures[name]["representations"]["chains"][ch.chainname]["cartoon"]=repr;var repr=ngl.addRepresentation("cartoon",{visible:trace_visibility,color:"#F3F3F3",sele:model_flag+"protein and :"+ch.chainname,opacity:.2});self.viewer.Structures[name]["representations"]["chains"][ch.chainname]["trace"]=repr}});self.viewer.Structures[name]["representations"]["selection"]["cartoon"]=ngl.addRepresentation("cartoon",{visible:false,sele:model_flag+"protein",color:"#FFE999"});self.viewer.Structures[name]["representations"]["selection"]["spacefill"]=ngl.addRepresentation("spacefill",{visible:false,sele:model_flag+"protein",color:"#FFE999"});self.viewer.Structures[name]["representations"]["selection"]["ball+stick"]=ngl.addRepresentation("ball+stick",{visible:false,sele:model_flag+"protein",color:"#FFE999"});self.viewer.Structures[name]["representations"]["keep_selection"]=[];self.viewer.Structures[name]["representations"]["multiple_selection"]=[];self.viewer.stage.autoView()}init_map(self,ngl){self.viewer.Density={obj:ngl,surface:{}};if(self.pdb_flag){self.viewer.Density["surface"]=ngl.addRepresentation("surface",{opacity:.1,color:"#33ABF9",flatShaded:false,background:false,opaqueBack:false,depthWrite:true,isolevel:5});self.viewer.message_manager.clear_em_message()}else{self.viewer.Density["surface"]=ngl.addRepresentation("surface",{color:"#33ABF9",depthWrite:true,isolevel:5});setTimeout(function(){self.viewer.stage.autoView();self.viewer.message_manager.clear_em_message()},6e3)}}}module.exports=loader_class},{}],2:[function(require,module,exports){"use strict";class message_class{constructor(args){var self=this;self.args=args}show_message(id){$j(".ngl_loading").css("display","block");$j(".ngl_loading").html('LOADING <b style="color:black;">'+id+"</b>")}show_no_file(){$j(".ngl_loading").css("display","block");$j(".ngl_loading").html('<b style="color:black;">NO MODEL IS AVAILABLE</b>')}clear_message(){$j(".ngl_loading").css("display","none");$j(".ngl_loading").empty()}show_em_message(id){$j(".ngl_em_loading").css("display","block");$j(".ngl_em_loading").html('<table style="valing:middle;"><tr><td>LOADING <b style="color:black;margin-right:10px;">'+id+'</b><td/><td><img src="/images/loading_em.gif" /></td></tr></table>')}clear_em_message(){$j(".ngl_em_loading").css("display","none");$j(".ngl_em_loading").empty()}}module.exports=message_class},{}],3:[function(require,module,exports){"use strict";class selector_class{constructor(viewer){var self=this;self.viewer=viewer;self.keep_selected=[]}keep_selection(){var self=this;var pdb=self.viewer.selected.pdb;var chain=self.viewer.selected.chain;var list=self.viewer.selected.residues;if(!pdb in self.viewer.Structures)return;if(!list||list.length==0){swal({title:"UNKNOWN RESIDUES",text:"STRUTURE RESIDUES OUT OF RANGE",timer:5e3,type:"error",showConfirmButton:true});return}var frame=top.document.getElementById("upRightBottomFrame").contentWindow.document;var instance=top.document.getElementById("upRightBottomFrame").contentWindow.instance;var frame_window=top.document.getElementById("upRightBottomFrame").contentWindow;var color;if(frame.getElementsByName(instance.selectedFeature.internalId).lentgh>0){color=frame.getElementsByName(instance.selectedFeature.internalId)[0].style.fill}else{color=frame_window.$j("[name="+instance.selectedFeature.internalId+"]").css("fill")}var label_selection="( :"+chain+" and "+list[parseInt(list.length/2)]+" and .CA )";var description;if(instance.selectedFeature.description&&instance.selectedFeature.description.length>15){description=instance.selectedFeature.type}else{description=instance.selectedFeature.type}description=description.replace("<b>","");description=description.replace("</b>","");description=description.replace('<b style="color:grey;">',"");if(description.length>25)description=description.substring(0,25);var label_text=description+" "+instance.selectedFeature.begin+"-"+instance.selectedFeature.end+":"+chain;if(instance.selectedFeature.begin==instance.selectedFeature.end){label_text=description+" "+instance.selectedFeature.begin+":"+chain}var selection="( :"+chain+" and ("+list.join(" or ")+"))";var id_=instance.selectedFeature.internalId;if(id_=="fake_0"){id_=id_+"_"+Math.floor(Math.random()*9999)+1;color="#FFE999"}var label_obj={id:id_,selection:selection,color:color,label_selection:label_selection,label_text:label_text,label_visible:true,text_visible:true};var result=$j.grep(self.keep_selected,function(e){return e.id==id_});if(result.length==0){self.keep_selected.push(label_obj);add_to_label_display(label_obj)}self.display_selection()}display_selection(){var self=this;var pdb=self.viewer.selected.pdb;if(self.keep_selected.length==0)return;self.viewer.Structures[pdb]["representations"]["keep_selection"].forEach(function(i){i.spacefill.setVisibility(false);i.label.setVisibility(false);self.viewer.Structures[pdb]["obj"].removeRepresentation(i.spacefill);self.viewer.Structures[pdb]["obj"].removeRepresentation(i.label)});self.viewer.Structures[pdb]["representations"]["keep_selection"]=[];self.keep_selected.forEach(function(i){var model_flag="";if(self.viewer.model>=0)model_flag="and /"+self.model.toString()+" ";var selection="protein "+model_flag+"and "+i.selection;var label_selection="protein "+model_flag+"and "+i.label_selection;var color=i.color;var representation=self.viewer.Structures[pdb]["obj"].addRepresentation("spacefill",{visible:i.label_visible,sele:selection,color:color});var selectionObject=new NGL.Selection(label_selection);var labelText={};var pdb_component=self.viewer.stage.getComponentsByName(pdb);if(pdb_component.list.length==0)pdb_component=self.viewer.stage.getComponentsByName(pdb.toUpperCase());if(pdb_component.list.length==0)pdb_component=self.viewer.stage.getComponentsByName(pdb.toLowerCase()+"_final.pdb");if(pdb_component.list.length==0){console.log("getComponentsByName failed -  args => "+pdb);return}pdb_component.list[0].structure.eachAtom(function(atomProxy){labelText[atomProxy.index]=i.label_text},selectionObject);var label=self.viewer.Structures[pdb]["obj"].addRepresentation("label",{visible:i.text_visible,showBackground:true,labelType:"text",labelText:labelText,fontFamily:"monospace",fontWeight:"bold",scale:2,sdf:true,showBackground:true,backgroundColor:"#FFFFFF",backgroundMargin:2.5,backgroundOpacity:.5,showBorder:true,borderWidth:.1,borderColor:"#000000",zOffset:25,color:color,sele:label_selection});self.viewer.Structures[pdb]["representations"]["keep_selection"].push({spacefill:representation,label:label})})}remove_selection(index){var self=this;var pdb=self.viewer.selected.pdb;var i=self.viewer.Structures[pdb]["representations"]["keep_selection"][index];i.spacefill.setVisibility(false);i.label.setVisibility(false);self.viewer.Structures[pdb]["obj"].removeRepresentation(i.spacefill);self.viewer.Structures[pdb]["obj"].removeRepresentation(i.label);self.viewer.Structures[pdb]["representations"]["keep_selection"].splice(index,1);self.keep_selected.splice(index,1);self.display_selection()}}module.exports=selector_class},{}],viewer_class:[function(require,module,exports){"use strict";const message_class=require("./message_class");const loader_class=require("./loader_class");const selector_class=require("./selector_class");class viewer_class{constructor(args){var self=this;self.stage=null;self.Structures={};self.Density={};self.ImportedStructures={};self.selected={pdb:"",chain:"",residues:[]};self.args=args;self.model=-1;self.load_ready=false;self.keep_selected=[];self.pdb_flag=false;self.default_color="#CFCFFF";self.default_color_c="#CFFFCF";self.message_manager=new message_class;self.loader_manager=new loader_class(self);self.selector_manager=new selector_class(self);document.addEventListener("DOMContentLoaded",function(){self.init_viewer()})}init_viewer(){var self=this;self.stage=new NGL.Stage("viewport");window.addEventListener("resize",function(event){self.stage.handleResize()},false);self.stage.setParameters({backgroundColor:"white",quality:"low"});self.loader_manager.load();self.add_mouse_click()}display_message(){var self=this}resize(){var self=this}add_mouse_click(){var self=this;self.stage.signals.clicked.add(function(pickingProxy){if(pickingProxy&&pickingProxy.atom&&pickingProxy.shiftKey){var atom=pickingProxy.atom;var cp=pickingProxy.canvasPosition;var pdb=top.global_infoAlignment.pdb;var chain=top.global_infoAlignment.chain;var uniprot=top.global_infoAlignment.uniprot;var seq_index=top.$ALIGNMENTS[pdb][chain][uniprot]["inverse"][atom.resno];if(atom.chainname!=chain){swal({title:"UNKNOWN RESIDUE",text:"THE RESIDUE IS NOT LOCATED IN THE CURRENT CHAIN",timer:5e3,type:"error",showConfirmButton:true});console.log(atom);console.log("atom.chainname = "+atom.chainname);console.log("top.global_infoAlignment.chain = "+top.global_infoAlignment.chain);return}if(seq_index){var selection={begin:seq_index,end:seq_index,frame:"null"};trigger_aa_selection(selection)}else{swal({title:"SELECTION ERROR",text:"SEQUENCE ALIGNMENT OUT OF RANGE",timer:5e3,type:"error",showConfirmButton:true})}}else if(pickingProxy&&pickingProxy.shiftKey){console.log("No residue selected")}})}keep_selection(){var self=this;self.selector_manager.keep_selection()}display_selection(){var self=this;self.selector_manager.display_selection()}remove_selection(index){var self=this;self.selector_manager.remove_selection(index)}multiple_highlight(pdb,chain,list){var self=this;self.remove_multiple_selection();var selection={};var color;list.forEach(function(i){color=i.color;var pdbPosList=top.getRangesFromTranslation(i.begin,i.end,top.alignmentTranslation);pdbPosList.forEach(function(j){selection[j]=true})});selection=Object.keys(selection);self.selected.residues=selection;if(selection.length==0)return;var model_flag="";if(self.model>=0)model_flag="and /"+self.model.toString()+" ";self.Structures[pdb]["representations"]["chains"][chain]["cartoon"].setSelection("protein "+model_flag+"and :"+chain);self.Structures[pdb]["representations"]["selection"]["cartoon"].setSelection("");self.Structures[pdb]["representations"]["selection"]["spacefill"].setSelection("protein "+model_flag+"and :"+chain+" and ("+selection.join(" or ")+")");self.Structures[pdb]["representations"]["selection"]["ball+stick"].setSelection("");self.Structures[pdb]["representations"]["selection"]["spacefill"].setColor(color);self.Structures[pdb]["representations"]["selection"]["cartoon"].setVisibility(false);self.Structures[pdb]["representations"]["selection"]["ball+stick"].setVisibility(false);self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(true)}global_highlight(pdb,list){var self=this;if(!pdb)return;self.remove_multiple_selection();self.reset_chain_view();var global_selection={};var global_cartoon=[];var color;for(var ch in list){global_cartoon.push(ch);var selection={};list[ch].forEach(function(i){color=i.color;var uniprot=Object.keys(top.$ALIGNMENTS[pdb][ch])[0];var ch_alignmentTranslation=top.$ALIGNMENTS[pdb][ch][uniprot].mapping;var pdbPosList=top.getRangesFromTranslation(i.begin,i.end,ch_alignmentTranslation);if(!(color in selection))selection[color]={};pdbPosList.forEach(function(j){selection[color][j]=true})});var keys=Object.keys(selection);keys.sort(function(a,b){return Object.keys(selection[b]).length-Object.keys(selection[a]).length});keys.forEach(function(color){var res=Object.keys(selection[color]);if(res.length>0){if(!(color in global_selection))global_selection[color]=[];global_selection[color].push(":"+ch+" and ("+res.join(" or ")+")")}})}var model_flag="";if(self.model>=0)model_flag="and /"+self.model.toString()+" ";var _cols=[self.default_color,self.default_color_c];if(global_cartoon.length==1)_cols=[];global_cartoon.forEach(function(sel,i){self.Structures[pdb]["representations"]["chains"][sel]["trace"].setVisibility(false);self.Structures[pdb]["representations"]["chains"][sel]["cartoon"].setVisibility(true);self.Structures[pdb]["representations"]["chains"][sel]["cartoon"].setColor(_cols[i])});self.Structures[pdb]["representations"]["selection"]["cartoon"].setVisibility(false);self.Structures[pdb]["representations"]["selection"]["ball+stick"].setVisibility(false);self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(false);for(var color in global_selection){if(global_selection[color].length>0){var selection_string="protein "+model_flag+"and (("+global_selection[color].join(") or (")+"))";self.Structures[pdb]["representations"]["multiple_selection"].push(self.Structures[pdb].obj.addRepresentation("spacefill",{visible:true,sele:selection_string,color:color}))}}}remove_multiple_selection(){var self=this;for(var pdb in self.Structures){if("representations"in self.Structures[pdb]&&"multiple_selection"in self.Structures[pdb]["representations"]){self.Structures[pdb]["representations"]["multiple_selection"].forEach(function(i){i.setVisibility(false);i.removeRepresentation()});self.Structures[pdb]["representations"]["multiple_selection"]=[]}if("representations"in self.Structures[pdb]&&"multiple_cartoon"in self.Structures[pdb]["representations"]){self.Structures[pdb]["representations"]["multiple_cartoon"].forEach(function(i){i.setVisibility(false);i.removeRepresentation()});self.Structures[pdb]["representations"]["multiple_cartoon"]=[]}}}play(){var self=this;var x=self.model;var intervalID=setInterval(function(){self.change_model(1);if(++x===2*self.args.n_models){window.clearInterval(intervalID)}},100)}change_model(flag){var self=this;var aux=self.model+flag;if(aux<0){aux=self.args.n_models-1}if(aux==self.args.n_models){aux=0}if(aux>=0&&aux<self.args.n_models){self.model=aux;self.highlight_chain(self.selected.pdb,self.selected.chain);self.dsiplay_selection();var evt=document.createEvent("CustomEvent");evt.initCustomEvent("modelChange",true,true,[aux+1]);window.top.document.dispatchEvent(evt);top.document.getElementById("upRightBottomFrame").contentWindow.dispatchEvent(evt)}else{self.display_selection()}}color_by_chain_simple(list,_pdb,chain,_color,non_exec){var self=this;var pdb=_pdb;self.highlight_chain(pdb,chain);var color="#FFE999";if(_color)color=_color;if(list.length<1){self.reset_view();return}if(!pdb in self.Structures)return;self.selected.pdb=pdb;self.selected.chain=chain;self.selected.residues=list;var model_flag="";if(self.model>=0)model_flag="and /"+self.model.toString()+" ";var shft=1;var L=list.slice(shft,list.length-shft);if(L.length>0){self.Structures[pdb]["representations"]["chains"][chain]["cartoon"].setSelection("protein "+model_flag+"and :"+chain+" and not ("+L.join(" or ")+")")}else{self.Structures[pdb]["representations"]["chains"][chain]["cartoon"].setSelection("protein "+model_flag+"and :"+chain)}self.Structures[pdb]["representations"]["selection"]["cartoon"].setSelection("protein "+model_flag+"and :"+chain+" and ("+list.join(" or ")+")");self.Structures[pdb]["representations"]["selection"]["spacefill"].setSelection("protein "+model_flag+"and :"+chain+" and ("+list.join(" or ")+")");self.Structures[pdb]["representations"]["selection"]["ball+stick"].setSelection("protein "+model_flag+"and :"+chain+" and ("+list.join(" or ")+")");self.Structures[pdb]["representations"]["selection"]["cartoon"].setColor(color);self.Structures[pdb]["representations"]["selection"]["spacefill"].setColor(color);self.Structures[pdb]["representations"]["selection"]["ball+stick"].setColor(color);if(list.length>3){self.Structures[pdb]["representations"]["selection"]["cartoon"].setVisibility(true);self.Structures[pdb]["representations"]["selection"]["ball+stick"].setVisibility(false)}else{self.Structures[pdb]["representations"]["selection"]["ball+stick"].setVisibility(true)}if(list.length<13){self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(true)}else{self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(false)}}load_more_atoms(pdb,chain,non_exec){var self=this;if(!self.selected.pdb)return;if(self.Structures[pdb]["representations"]["selection"]["spacefill"].visible){self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(false)}else{self.Structures[pdb]["representations"]["selection"]["spacefill"].setVisibility(true)}}show_hetero(non_exec){var self=this;for(var __name in self.Structures){if(self.Structures[__name]["representations"]){if(self.Structures[__name]["representations"]["hetero"].visible){self.Structures[__name]["representations"]["hetero"].setVisibility(false);self.Structures[__name]["representations"]["nucleic"].setVisibility(false)}else{self.Structures[__name]["representations"]["hetero"].setVisibility(true);self.Structures[__name]["representations"]["nucleic"].setVisibility(true)}}}}show_volume(non_exec){var self=this;self.Density["surface"].setVisibility(true)}hide_volume(non_exec){var self=this;self.Density["surface"].setVisibility(false)}highlight_chain(pdb,chain,non_exec){var self=this;if(!self.Structures[pdb])return;self.remove_multiple_selection();self.reset_chain_view();self.reset_selection_view();var model_flag="";if(self.model>=0)model_flag="and /"+self.model.toString()+" ";self.Structures[pdb]["representations"]["chains"][chain]["trace"].setVisibility(false);self.Structures[pdb]["representations"]["chains"][chain]["cartoon"].setVisibility(true);self.selected.pdb=pdb;self.selected.chain=chain;self.selected.residues=[]}reset_selection_view(){var self=this;for(var _p in self.Structures){for(var type in self.Structures[_p]["representations"]["selection"]){self.Structures[_p]["representations"]["selection"][type].setVisibility(false)}}}reset_chain_view(){var self=this;var model_flag="";if(self.model>=0)model_flag="and /"+self.model.toString()+" ";for(var s in self.Structures){for(var ch in self.Structures[s]["representations"]["chains"]){var repr=self.Structures[s]["representations"]["chains"][ch];repr["trace"].setSelection("protein "+model_flag+"and :"+ch);repr["trace"].setVisibility(true);repr["cartoon"].setSelection("protein "+model_flag+"and :"+ch);repr["cartoon"].setColor(self.default_color);repr["cartoon"].setVisibility(false)}}}reset_view(non_exec){var self=this;self.remove_multiple_selection();var pdb=self.selected.pdb;var chain=self.selected.chain;self.highlight_chain(pdb,chain)}center_view(non_exec){var self=this;if(self.stage)self.stage.autoView()}clear_selected(non_exec){var self=this;self.reset_view()}load_surface(emd,threshold,maxVolSize,non_exec){var self=this;self.Density["surface"].setParameters({isolevel:threshold})}open_url(pdb,append_flag,chain,non_exec){var self=this;self.stage.removeAllComponents();if(non_exec){self.message_manager.show_no_file();return}self.p_chain=chain;var pdb_code=pdb;if(pdb_code.includes("interactome_pdb")){self.message_manager.show_message("FILE");self.stage.loadFile(pdb_code,{ext:"pdb",firstModelOnly:true}).then(function(i){self.loader_manager.initLocalStructure(self.loader_manager,i,true);self.highlight_chain(infoGlobal.activepdb,infoGlobal.activechain)}).catch(function(e){console.error(e);var url=url_file;console.log("URL "+url_file+" ERROR")})}else{self.message_manager.show_message(pdb_code.toUpperCase());var url_file="rcsb://"+pdb_code.toUpperCase()+".mmtf";self.stage.loadFile(url_file,{ext:"mmtf",firstModelOnly:true,sele:":"+chain}).then(function(i){self.loader_manager.initChain(self.loader_manager,i)}).catch(function(e){console.error(e);var url=url_file;console.log("URL "+url_file+" ERROR")})}}hide_hetero(non_exec){var self=this;self.show_hetero()}write_image(){var self=this;self.stage.makeImage({factor:1,antialias:true,trim:false,transparent:true}).then(function(blob){NGL.download(blob,"screenshot.png")})}}module.exports=viewer_class},{"./loader_class":1,"./message_class":2,"./selector_class":3}]},{},[]);
