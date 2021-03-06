module Interactome3dManager
  module FetchInteractome3d
    
    include GlobalTools::FetchParserTools
    include MainManager::ToolsMain::BuildAlignment

    def getPDBstructre(file,type)
      filename = Settings.GS_LocalInteractome3D+"pdb/"+file
      unless File.file?(filename) then
        url = Settings.GS_Interactome3Dpdb+"filename="+file+"&type="+type
        xml = nil
        begin
          xml = getUrl(url)
        rescue Exception => e
          raise StandardError, "URL>\n"+url+"\nERROR>\n"=>e.message+"\nTRACE>\n"+JSON.parse(e.backtrace.inspect).join("\n")
        end
        if xml !~ /contents/ then
          raise "XML <contents> tag not found at >"+url+"<"
        end
        pdb = xml.split("<contents>")[1].split("</contents>")[0]
        if pdb !~ /ATOM/ then
          raise "PDB ATOM tag not found in >"+pdb+"<"
        end
        File.open(filename, 'w') {|f| f.write(pdb) }
        #File.open(filename,"w").write(pdb)
      end
    end

    def alignPDBstructre(pdbId,seqs,_acc)
      alignment = Interactome3dDatum.find_by(pdbId: pdbId)
      if alignment.nil? then
        file = pdbId
        filename = Settings.GS_LocalInteractome3D+"pdb/"+file
        localScripts = Settings.GS_LocalScripts
        mapping  =  JSON.parse(`#{localScripts}/structure_to_fasta_json #{filename}`)
        raise "#{localScripts}/structure_to_fasta_json #{filename}" unless mapping.key? 'mapping'
        alignment = {}
        mapping['mapping'].each do |ch,map|
          alignment[ch] = {}
          uniprot_seq = seqs[ch]
          ch_seq = mapping['sequences'][ch]
          acc = _acc[ch]
          alignment[ch][acc] = align_sequences_mc(uniprot_seq,ch_seq,map,rand=nil)
        end
        Interactome3dDatum.create(pdbId: pdbId, data: alignment.to_json)
      else
        alignment = JSON.parse(alignment.data)
      end

      return alignment
    end

  end
end

