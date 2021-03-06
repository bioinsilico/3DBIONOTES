class FramesJsmolController < ApplicationController


  include GlobalTools::FetchParserTools

  BaseUrl = Settings.GS_BaseUrl

  def jsmolIFrame
    pdbListRaw = params[:pdbs]
    if pdbListRaw.nil? then
      pdbListRaw = []
    end
    emdbRaw = params[:emdb]
    origin = params[:origin]
    @origin = origin
    @emdb = emdbRaw
    @viewerType = params[:viewer_type]
    @n_models = params[:n_models]
    if !emdbRaw.nil? and !emdbRaw.empty?
      @emdb = emdbRaw
      url = BaseUrl+"api/info/EMDB/data/"+@emdb
      jsonData = getUrl(url)
      myData = JSON.parse(jsonData)
      if myData["contour"].nil?
        stThr = myData["limits"]["start"]
        endThr = myData["limits"]["end"]
        @threshold = (stThr + endThr)/2.0
      else
        @threshold = myData["contour"]
      end
      @thrLimits = {}
      @thrLimits = myData["limits"]
      url2 = BaseUrl+"api/info/EMDB/size/"+@emdb
      data2 = getUrl(url2)
      @maxSizeVol = data2
    end
    if !pdbListRaw.nil?
      if pdbListRaw!="null" and  pdbListRaw.length > 0
        @pdbList = JSON.parse(pdbListRaw)
      else
        @pdbList = []
      end
    end
  end
end
