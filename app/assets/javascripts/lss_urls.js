//
// LSS URLs
//----------------------------------------------------------------------------//

//
// URLs used to view result sets.
//
LSS.exportUrls = {
  cmtv: "http://velarde.ncgr.org:7070/isys/launch?svc=org.ncgr.cmtv.isys." +
    "CompMapViewerService%40--style%40http://velarde.ncgr.org:7070/isys/bin/" +
    "Components/cmtv/conf/cmtv_combined_map_style.xml%40--combined_display%40" +
    document.URL + "/search.gff%3F",

  tab: document.URL + "/search.txt?",

  gff: document.URL + "/search.gff?"
};

//
// GBrowse URLs
//
// Substitute placeholders %foo% with actual values before creating links.
//
LSS.gbrowseUrls = {
  //medtrv4_jcvi: "http://medicago.jcvi.org/medicago/jbrowse/?data=data%2Fjson%2Fmedicago&loc=%ref%%3A%start%..%stop%&tracks=DNA%2Cgene_models&highlight=%ref%%3A%start%..%stop%",
  medtrv4_jcvi: "http://medicago.jcvi.org/medicago/jbrowse/?data=data%2Fjson%2Fmedicago&loc=%ref%%3A%start%..%stop%&tracks=DNA%2Cgene_models&highlight=",

  medtrv4_lis: "http://medtr.comparative-legumes.org/gb2/gbrowse/4.0/?" +
    "name=%ref%:%start%..%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  medtr_jcvi: "http://www.jcvi.org/cgi-bin/gb2/gbrowse/mtruncatula/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;i" +
    "cache=on;drag_and_drop=on;show_tooltips=on;grid=on;label=Gene-" +
    "Transcripts_all-Transcripts_Bud-Transcripts_Blade-Transcripts_Root-" +
    "Transcripts_Flower-Transcripts_Seed-Transcripts_mtg-Gene_Models-" +
    "mt_fgenesh-genemarkHMM-genscan-fgenesh-TC_poplar-TC_maize-TC_" +
    "arabidopsis-TC_Lotus-TC_soybean-TC_cotton-TC_medicago-TC_rice-" +
    "TC_sorghum;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  medtr_lis: "http://medtr.comparative-legumes.org/gb2/gbrowse/3.5.1/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  medtr_hapmap: "http://www.medicagohapmap.org/fgb2/gbrowse/mt35/?" +
    "q=%ref%:%start%..%stop%;t=Genes+Transcript+ReadingFrame+Translation+" +
    "SNP+SNP_HM005+CovU_HM005+SNP_HM006+CovU_HM006+SNP_HM029+CovU_HM029;c=1;" +
    "add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  medtr_affy: "http://mtgea.noble.org/v2/probeset.php?id=",

  glyma_soybase: "http://soybase.org/gb2/gbrowse/gmax1.01/?" +
    "ref=%ref%;start=%start%;stop=%stop%;version=100;cache=on;" +
    "drag_and_drop=on;show_tooltips=on;grid=on;add=%ref%+LIS+" +
    "LIS_Query_%query%+%hit_from%..%hit_to%",

  lotja_kazusa: "http://gsv.kazusa.or.jp/cgi-bin/gbrowse/lotus/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;" +
    "label=contig-phase3-phase1%%2C2-annotation-GMhmm-GenScan-blastn-tigrgi-" +
    "blastx-marker;grid=on;add=%ref%+LIS+LIS_Query_%query%+" +
    "%hit_from%..%hit_to%",

  cajca_lis: "http://cajca.comparative-legumes.org/gb2/gbrowse/Cc1.0/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  cicar_lis: "http://cicar.comparative-legumes.org/gb2/gbrowse/Ca1.0/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  genfam_lis: "http://leggle.comparative-legumes.org/gene_families/name=" +
    "%ref_id%",

  phavu_phytozome: "http://www.phytozome.net/cgi-bin/gbrowse/commonbean/?" +
    "name=%ref%%3A%hit_from%..%hit_to%"
};

//
// Replace GBrowse URL placeholders with correct values.
//
LSS.formatGbrowseUrl = function(data, url, type) {

  var self = this,
      hit,
      chr,
      area = 50000,
      hit_from,
      hit_to,
      ref_id,
      proteome_genemodel = false;

  ref_id = data.ref_id;

  // Ignore hits to transcriptomes
  if (data.ref.search(/transcriptome/) >= 0) {
    return "";
  }

  //
  // Hit to a proteome or genemodel.
  //

  if (data.ref.search(/proteome/) >= 0 || data.ref.search(/genemodel/) >= 0) {
    // Remove the query string and add name=ref_id.
    if (url.search(/jbrowse/) >= 0) {
        url = url.replace("loc=%ref%%3A%start%..%stop%","loc=%ref_id%");
    }
    else {
        url = url.slice(0, url.lastIndexOf('?') + 1) + 'name=%ref_id%';
    }
    proteome_genemodel = true;

  }

  //
  // Hit to a genome.
  //

  hit = data.ref_id.slice(data.ref_id.lastIndexOf('_') + 1,
      data.ref_id.length);

  // Format hit for special cases.
  switch(type) {
    case "soybase":
      if (hit.length < 4) {
        chr = hit.slice(2);
        hit = "chr0" + chr;
      }
      break;
    case "jcvi":
      if (hit.length < 5) {
        chr = hit.slice(3);
        hit = "chr" + chr;
      }
      break;
    case "medtr-lis":
      if (hit.search(/chr[0-9]/) !== -1) {
        hit = "Mt" + hit.substring(3);
      }
      break;
    case "hapmap":
      hit = hit.replace(/0/g, '');
      break;
    case "cajca-lis":
      if (hit.search(/CcLG[0-9]+/) !== -1) {
        hit = "Cc" + hit.substring(4);
      }
      break;
    case "cicar-lis":
      hit = hit.replace(/0/g, '');
      break;
    case "kazusa":
      if (proteome_genemodel) {
        ref_id = "CDS:" + ref_id;
      }
      break;
    default:
      break;
  }

  // Make sure start < stop.
  function format_start_stop(start, stop) {
    hit_from = start;
    hit_to = stop;
    if (start > stop) {
      hit_from = stop;
      hit_to = start;
    }
  }

  format_start_stop(data.hit_from, data.hit_to);

  // Expand the GBrowse viewing interval while retaining the orientation.
  if (hit_from <= hit_to) {
    hit_from = hit_from > area ? (hit_from - area) : 1;
    hit_to = hit_to + area;
  } else {
    hit_from = hit_from + area;
    hit_to = hit_to > area ? (hit_to - area) : 1;
  }

  url = url.replace(/%ref%/g, hit);
  url = url.replace(/%start%/g, hit_from);
  url = url.replace(/%stop%/g, hit_to);
  url = url.replace(/%query%/g, data.query);
  url = url.replace(/%hit_from%/g, data.hit_from);
  url = url.replace(/%hit_to%/g, data.hit_to);
  url = url.replace(/%ref_id%/g, ref_id);

  return url;

}


//
// Add Glyma url.
//
LSS.addGlyma = function(data) {

  var self = this,
      url = self.gbrowseUrls.glyma_soybase,
      urls = [];

  urls.push({
    "name": "Glycine max - Soybase",
    "url": self.formatGbrowseUrl(data, url, "soybase")
  });

  return urls;

};

//
// Add Medtr urls.
//
LSS.addMedtr = function(data) {

  var self = this,
      urls = [];

  urls.push({
    "name": "Medicago truncatula - JCVI",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.medtr_jcvi, "jcvi")
  });

  urls.push({
    "name": "Medicago truncatula - Hapmap",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.medtr_hapmap, "hapmap")
  });

  urls.push({
    "name": "Medicago truncatula - LIS",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.medtr_lis, "medtr-lis")
  });

  return urls;

};

//
// Add Medtr v4 urls.
//
LSS.addMedtrv4 = function(data) {

  var self = this,
      urls = [];

  urls.push({
    "name": "Medicago truncatula - JCVI",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.medtrv4_jcvi, "jcvi")
  });

  urls.push({
    "name": "Medicago truncatula - LIS",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.medtrv4_lis, "medtr-lis")
  });

  return urls;

};
//
// Add Lotja url.
//
LSS.addLotja = function(data) {

  var self = this,
      url = self.gbrowseUrls.lotja_kazusa,
      urls = [];

  urls.push({
    "name": "Lotus japonicus - Kazusa",
    "url": self.formatGbrowseUrl(data, url, "kazusa")
  });

  return urls;

};

//
// Add Cajca url.
//
LSS.addCajca = function(data) {

  var self = this,
      url = self.gbrowseUrls.cajca_lis,
      urls = [];

  urls.push({
    "name": "Cajanus cajan - LIS",
    "url": self.formatGbrowseUrl(data, url, "cajca-lis")
  });

  return urls;

};

//
// Add Cicar url.
//
LSS.addCicar = function(data) {

  var self = this,
      url = self.gbrowseUrls.cicar_lis,
      urls = [];

  urls.push({
    "name": "Cicer arietinum - LIS",
    "url": self.formatGbrowseUrl(data, url, "cicar-lis")
  });

  return urls;

};

//
// Add Genfam (gene family) url.
//
LSS.addGenfam = function(data) {

  var self = this,
      url = self.gbrowseUrls.genfam_lis,
      urls = [];

  urls.push({
    "name": "Gene family consensus - LIS",
    "url": self.formatGbrowseUrl(data, url, "gene_family-lis")
  });

  return urls;

};

//
// Add Phavu url.
//
LSS.addPhavu = function(data) {

  var self = this,
      url = self.gbrowseUrls.phavu_phytozome,
      urls = [];

  urls.push({
    "name": "Phaseolus vulgaris - Phytozome",
    "url": self.formatGbrowseUrl(data, url)
  });

  return urls;

};


//
// Add linkouts to GBrowse instances.
//
LSS.addGbrowseLinkouts = function(data) {

  var self = this,
      hit,
      links = [];

  hit = data.ref;

  if (hit.search(/glyma_/) === 0) {
    links.push(self.addGlyma(data));
  }
  if (hit.search(/medtr_.*4/) === 0) {
    links.push(self.addMedtrv4(data));
  }
  else if (hit.search(/medtr_/) === 0) {
    links.push(self.addMedtr(data));
  }
  if (hit.search(/lotja_/) === 0) {
    links.push(self.addLotja(data));
  }
  if (hit.search(/cajca_/) === 0) {
    links.push(self.addCajca(data));
  }
  if (hit.search(/cicar_/) === 0) {
    links.push(self.addCicar(data));
  }
  if (hit.search(/phavu_/) === 0) {
    links.push(self.addPhavu(data));
  }
  if (hit.search(/genefam/) === 0) {
    links.push(self.addGenfam(data));
  }

  return links;

};

//
// Format link outs and return an array of objects containing url and name
// properties.
//
LSS.formatLinkouts = function(data) {

  var self = this,
      hit,
      links = [];

  if (_.isUndefined(data.hit_display_id) || _.isNull(data.hit_display_id)) {
    return;
  }

  // Add ref and ref_id properties if undefined.
  // This is only true if data was called via ajax without being passed
  // through LSS.prepData.
  // Ex: QUORUM.viewDetailedReport
  if (!_.has(data, "ref") || !_.has(data, "ref_id")) {
    hit = data.hit_display_id.split(':');
    _.extend(data, { ref: hit[0], ref_id: hit[1] });
  }

  // Add the GBrowse linkouts to each hsp.
  // Ignore linkouts with an empty name or url property.
  _.each(self.addGbrowseLinkouts(data), function(link) {
    _.each(link, function(l) {
      if (!_.isEmpty(l.url) && !_.isEmpty(l.name)) {
        links.push(l);
      }
    });
  });

  return links;

};

//
// End LSS URLs
//----------------------------------------------------------------------------//
