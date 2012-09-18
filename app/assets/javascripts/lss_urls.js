//
// LSS URLs
//
// Author: Ken Seal
//----------------------------------------------------------------------------//

//
// URLs used to view result sets.
//
LSS.exportUrls = {
  cmtv: "http://velarde.ncgr.org:7070/isys/launch?svc=org.ncgr.cmtv.isys." +
    "CompMapViewerService%40--style%40http://velarde.ncgr.org:7070/isys/bin/" +
    "Components/cmtv/conf/cmtv_combined_map_style.xml%40--combined_display%40" +
    document.URL + "/get_quorum_search_results.gff%3F",

  tab: document.URL + "/get_quorum_search_results.txt?"
};

//
// GBrowse URLs
//
// Substitute placeholders %foo% with actual values before creating links.
//
LSS.gbrowseUrls = {
  mt_jcvi: "http://www.jcvi.org/cgi-bin/gb2/gbrowse/mtruncatula/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;i" +
    "cache=on;drag_and_drop=on;show_tooltips=on;grid=on;label=Gene-" +
    "Transcripts_all-Transcripts_Bud-Transcripts_Blade-Transcripts_Root-" +
    "Transcripts_Flower-Transcripts_Seed-Transcripts_mtg-Gene_Models-" +
    "mt_fgenesh-genemarkHMM-genscan-fgenesh-TC_poplar-TC_maize-TC_" +
    "arabidopsis-TC_Lotus-TC_soybean-TC_cotton-TC_medicago-TC_rice-" +
    "TC_sorghum;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_lis: "http://medtr.comparative-legumes.org/gb2/gbrowse/3.5.1/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_hapmap: "http://www.medicagohapmap.org/cgi-bin/gbrowse/mthapmap/?" +
    "q=%ref%:%start%..%stop%;t=Genes+Transcript+ReadingFrame+Translation+" +
    "SNP+SNP_HM005+CovU_HM005+SNP_HM006+CovU_HM006+SNP_HM029+CovU_HM029;c=1;" +
    "add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_affy: "http://mtgea.noble.org/v2/probeset.php?id=",

  gm_soybase: "http://soybase.org/gb2/gbrowse/gmax1.01/?" +
    "ref=%ref%;start=%start%;stop=%stop%;version=100;cache=on;" +
    "drag_and_drop=on;show_tooltips=on;grid=on;add=%ref%+LIS+" +
    "LIS_Query_%query%+%hit_from%..%hit_to%",

  lj_kazusa: "http://gsv.kazusa.or.jp/cgi-bin/gbrowse/lotus/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;" +
    "label=contig-phase3-phase1%%2C2-annotation-GMhmm-GenScan-blastn-tigrgi-" +
    "blastx-marker;grid=on;add=%ref%+LIS+LIS_Query_%query%+" +
    "%hit_from%..%hit_to%",

  cc_lis: "http://cajca.comparative-legumes.org/gb2/gbrowse/1.0/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  gf_lis: "http://leggle.comparative-legumes.org/gene_families/name=%ref_id%"
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
      hit_to;

  //
  // Hit to a proteome.
  //

  if (data.ref.search(/proteome/) >= 0) {
    return url.slice(0, url.lastIndexOf('?') + 1) + 'name=' + data.ref_id;
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
  url = url.replace(/%start%/, hit_from);
  url = url.replace(/%stop%/, hit_to);
  url = url.replace(/%query%/, data.query);
  url = url.replace(/%hit_from%/, data.hit_from);
  url = url.replace(/%hit_to%/, data.hit_to);
  url = url.replace(/%ref_id%/, data.ref_id);

  return url;

}

//
// Add Gm url.
//
LSS.addGm = function(data) {

  var self = this,
      url = self.gbrowseUrls.gm_soybase,
      urls = [];

  urls.push({
    "name": "Glycine max - Soybase",
    "url": self.formatGbrowseUrl(data, url, "soybase")
  });

  return urls;

};

//
// Add Mt urls.
//
LSS.addMt = function(data) {

  var self = this,
      urls = [];

  urls.push({
    "name": "Medicago truncatula - JCVI",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_jcvi, "jcvi")
  });

  urls.push({
    "name": "Medicago truncatula - Hapmap",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_hapmap, "hapmap")
  });

  urls.push({
    "name": "Medicago truncatula - LIS",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_lis, "medtr-lis")
  });

  return urls;

};

//
// Add Lj url.
//
LSS.addLj = function(data) {

  var self = this,
      url = self.gbrowseUrls.lj_kazusa,
      urls = [];

  urls.push({
    "name": "Lotus japonicus - Kazusa",
    "url": self.formatGbrowseUrl(data, url)
  });

  return urls;

};

//
// Add Cc url.
//
LSS.addCc = function(data) {

  var self = this,
      url = self.gbrowseUrls.cc_lis,
      urls = [];

  urls.push({
    "name": "Cajanus cajan - LIS",
    "url": self.formatGbrowseUrl(data, url, "cajca-lis")
  });

  return urls;

};

//
// Add Gf (gene family) url.
//
LSS.addGf = function(data) {

  var self = this,
      url = self.gbrowseUrls.gf_lis,
      urls = [];

  urls.push({
    "name": "Gene family consensus - LIS",
    "url": self.formatGbrowseUrl(data, url, "gene_family-lis")
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

  if (hit.search(/gm_/) === 0) {
    links.push(self.addGm(data));
  }
  if (hit.search(/mt_/) === 0) {
    links.push(self.addMt(data));
  }
  if (hit.search(/lj_/) === 0) {
    links.push(self.addLj(data));
  }
  if (hit.search(/cc_/) === 0) {
    links.push(self.addCc(data));
  }
  if (hit.search(/genefam/) === 0) {
    links.push(self.addGf(data));
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

  // Add ref and ref_id properties if undefined.
  // This is only true if data was called via ajax without being passed
  // through LSS.prepData.
  // Ex: QUORUM.viewDetailedReport
  if (!_.has(data, "ref") || !_.has(data, "ref_id")) {
    hit = data.hit_display_id.split(':');
    _.extend(data, { ref: hit[0], ref_id: hit[1] });
  }

  // Add the GBrowse linkouts to each hsp.
  _.each(self.addGbrowseLinkouts(data), function(link) {
    _.each(link, function(l) {
      links.push(l);
    });
  });

  return links;

};

//
// End LSS URLs
//----------------------------------------------------------------------------//
