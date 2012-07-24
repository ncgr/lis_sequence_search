//
// Example Sequences for LSS interface.
//
var SEQUENCES = SEQUENCES || {};

// Add example sequences and select appropriate blast dbs.
SEQUENCES.addSequences = function(id) {

  var sequence = $("#job_sequence"),
    blastn = $("#job_blastn_job_attributes_queue"),
    blastn_db = $("#job_blastn_job_attributes_blast_dbs option"),

    blastx = $("#job_blastx_job_attributes_queue"),
    blastx_db = $("#job_blastx_job_attributes_blast_dbs option"),

    tblastn = $("#job_tblastn_job_attributes_queue"),
    tblastn_db = $("#job_tblastn_job_attributes_blast_dbs option"),

    blastp = $("#job_blastp_job_attributes_queue"),
    blastp_db = $("#job_blastp_job_attributes_blast_dbs option"),

    cdna = ">TOG900080\n" +
		  "TGATAGGATAATTCTAGACAAAACATTAGCCGATCAAGTGTCATCATGGAAAAGCAGCAGGGGCCTTAGTGATACAGTG" +
		  "GTGACTGATCATGCTTGTTCTGGGGAAACATGCTCGTACTACGCAATTGGAGATGTATTTATTTGTGAAAAGACTGGAC" +
		  "AAGTTCATGTTTGTGACGAAACATGTAGGGAAGTAGTAATGGATCCCACCAACGAGCTTTTGGTCTGTACAATATCTGG" +
		  "CCACTGTTTTGACAGATTGCTATCACCTGCTGAAATGGAGCCTGATGCTGAGCAGCAGCAAGGTGGTGCGGCAGATGAG" +
			"GCAGAACCGTTTATGGGATCTGGCCGTTTTGCACGGGCTTATTTGCTGGGATACAATTGTGCTGATGAAAAGGAGCTTG" +
			"AAGCTACTTTGAGGTTTTGCTGATCCCTATTGGCCCTTCTGGAGTGGATGATCTCATGTCTCAGCATTTACCTATTTAA" +
			"GATCAAATAAATCGGGTTTCCTTTTCGTGTTTCTCTTGGCATAAGAATGTTTGATTAGATCTAGATTATGAAACTCTAA" +
			"TCGTCTTCTATATTAATAATTGTATGCTTAAATTTATAGTTGAAATTCCATTGATGAATTTTTCTT\n" +
			">TOG896930\n" +
			"CGTTCGCATTGTTCACTCACCATACGCACTTCCATTTTCATCTCCCACCGTCGCATTTTCTTCGGATCTGAAATTCCTC" +
			"ACCATGAATCGCCACCACGATCCCAATCCATTCGACGAAGACGAAGTCAATCCCTTCTCGAACGGTGCTGCTCCTGGAT" +
			"CTAAATCACGTATTCCACCATTGGCATCCGAACCACTGGGCTTTGGTCAAAGACATGATGCTACAGTTGATATTCCTTT" +
			"GGATACCACAAATGAGCCTAAAAAAAAAGGTCAAGAGCTAGCAGCTTGGGAAGCAGATTTGAAAAGGAGAGAAAAGGAT" +
			"TTAAAAAGAAGAGAGGATGCTGTTTCTAGAGCTGGTGTGCCTGTTGATGATAAGAATTGGCCTCCGATTTTCCCAATTA" +
			"TTCACCATGATATTGCCAATGAGATACCGGTTCATGCTCAGAGGCTGCAATATTTGGCCTTTGCAAGTTGGTTAGGAAT" +
			"TGTTCTCTGCCTTGTTTTTAATGTAGTTGCTGTGATGGTCTGTTGGATCAGAGGCGGTGGTGTTAAAATTTTTTTCCTT" +
			"GCGGTGATCTATGCTCTACTTGGTGTTCCCCTTTCATATGTGCTTTGGTACAGGCCCCTTTATCGTGCTATGAGGACGG" +
			"ATAGTGCACTGAAGTTTGGCTGGTTTTTCATGTTCTACTTGCTTCATATTGCATTTTGCATCTTTGCTGCAATTGCACC" +
			"TCCAGTTGTTTTTCATGGGAAATCATTAACGGGCATCCTTGCAGCAACTGACGTCTTCTCAGACCATGTATTGGTTGGG" +
			"ATATTCTATTTGGTTGGATTTGGCCTGTTTTGCTTGGAGTCTCTTCTAAGCTTGTGGGTAATTCAGAAAATATACCTGT" +
			"TTTTCCGGGGGCATAAGTGAGGCTACTCAGGATTTTGATCCATCGGCTTTTATGATATCAGTCACTTCCCGGCGTGGCT" +
			"TAGTATATTCTTTCTTTTTGTCTATCCTCTTTTTTCGCTTGCAATATTTTCGTGTGATATTGTTTGTTGTTGTAGTCTA" +
			"GTTCTTGTTACAGAGCTTAGTGTGTAATTTCCTGTGTAATGAATTCTGTGAAGTTTAGTAATTTTCTAGTGTAACAATA" +
			"ACCAAGCTTTGCTTTCGATAAGCATATATGTAGTGGATTTCCATAAGGAATTATTGTAGTGCTATTGTAGTTGTGAATA" +
			"GTGACACCCCTCGGAGGTTTTCTATTTGTAAGACAGCACTGATGCAAACACTTTAGTTAAAATTCATGTAGGATCTATT" +
			"CAATT\n" +
			">TOG913027\n" +
			"AAGGACTAGTTGATTTGCTACATGTGTTCTGTGTTGTTCTTGCTTTGGTAAATGTGTCTCTAGTGAAAGCAGAAGATCC" +
			"ATACAAGTTCTACACATGGACAGTGACTTATGGAACTCTTTCTCCTCTGGGCAGTCCTCAACAAGTTATTCTGATCAAT" +
			"GGTCAGTTTCCTGGTCCAAGACTTGACTTGGTAACTAATGACAACGTGATTCTCAACCTCATCAACAAGCTGGATGAGC" +
			"CATTCTTGCTCACATGGAATGGCATTAAGCAGAGGAAAAATTCTTGGCAAGATGGGGTTTTAGGAACTAACTGTCCCAT" +
			"TCCTCCAAACTCAAATTACACTTACAAGTTTCAGGCCAAGGATCAGATTGGCACTTATACATACTTTCCATCAACTAAG" +
			"ATGCATAAAGCTTCTGGAGGGTTTGGAGCTCTCAATGTTCTTCATAGATCTGTCATCCCAATCCCTTATCCAAACCCTG" +
			"ATGGAGATTTTACATTACTCATTGGTGATTGGTACAAAACTAGCCACAAGACATTAAGCCAAACATTGGATTCTGGGAA" +
			"ATCTCTTGCCTTTCCTGATGGCCTCCTTATCAATGGCCAGGCTCATTCTACCTTCACTGTTAACCAGGGAAAAACCTAT" +
			"ATGTTCAGGATCTCAAATGTTGGTCTGTCAACCTCAATTAACTTCAGAATTCAGGGACATACCCTAAAACTAGTTGAGG" +
			"TTGAAGGATCACACACTATCCAGAACGAATACGACTCGCTTGATGTGCATGTTGGCCAATCAGTTTCTGTGTTAGTAAC" +
			"CTTAAATCAACCTCCAAAGGACTATTACATCGTTGCCTCAACAAGATTTACCAAGACTGTTCTCACTACAACCTCAGTG" +
			"CTACACTAAAATTCTCAGTCAGCCGCATCAGGATCCTTGCCTGCTCCCCCTGCTGACAAT\n" +
			">TOG919655\n" +
			"ATTGAAATACGTCTTGCAAAAGCTGAAGCTATTAATTGGACATCTCTCGAATATAGCAAGGATATGCCTCCCCAAAAAA" +
			"TTAAAGTGCCTACAATTCAATCTGAAAGGCCTGCATACCCATCATCAAAGCCAAGGACAAAAGATTGGGATAAGTTGGA" +
			"AGCTATGGTGAAAAAAGAGGAGAAAGAAGAAAAGCTGGATGGTGATGCTGCTTTGAATAAATTGTTCCGTGATATTTAT" +
			"CAAAATGCTGATGAGGACATGCGGAGAGCAATGAGCAAGTCATTTCTGGAGTCAAATGGAACAGTGCTGTCAACGGATT" +
			"GGAAAGAAGTGGGATCCAAGAAGGTGGAAGGAAGTCCTCCAGAAGGTATGGAATTGAAGAAATGGGAGTACTAATTCAG" +
			"TACAAGCTGATGCTCATGAGAGTTCAAATTCACAAAAATAAATTCTGAGAAGGGAAACAAATTCTGTAATCTTAATGGT" +
			"ATCGGTTATTTTG\n" +
			">TOG906701\n" +
			"TGAGATCATGCGCGAAATGATGAGGAATACAGACAGAGCCATGAGCAACATTGAGTCTTCTCCTGAGGGATTCAACATG" +
			"CTGAGGCGCATGTATGAAAATGTTCAAGAACCATTTTTAAATGCCACTACAATGGCTGGTAATACAGGAAATGATGGTG" +
			"TCAGGAATCAATCAACTAATCCCTCAACGACTAATTCTGAAGCAACTTCCCCTGTTCCAAATACTAACCCACTTCCTAA" +
			"TCCTTGGTCCTCCACTGGAACTGGAGGTGCACAAGGCAACACCAGAAGGACAACTGCTGGTGGGGATGCTCGGCAGCAG" +
			"GCACTCACTGGACTAGGAGGACTTGGTGTGCCAGATCTTGAAGGCATGATGGGTGGTATGCCAGATCCTGCTATGTTGA" +
			"CCCAATTAATGCAAAATCCAGCTATTTCACAAATGATGCAGAGTATCCTTTCCAATCCACAGACTATGAATCAGATTCT" +
			"TGGTCTCAATACTGAGCAGCGTGGCATGCCTGATCTAAACTCACTAAGAAGATGTGATGCAAAACCCAGAGTTTCTTCG" +
			"CTTATTTTCCTCACCTGAGACACTGCAGCAACTCATGTCTTTCCAGCAATCTCTTATGTCTCAAGTTGG\n" +
			">TOG897619\n" +
			"AGCAGTGTTCCCATGAAACCTTCCCACTGAGTCAACTCACTCTGTACATAAAACCCTCTTCATCATCATCATGGCTTCTC" +
			"AAGTTTTTCTTCAGCAAGGGTTGTTACTGTTTGCCCCAAACCAATGTTCTCCAACCAAGCTCGGTGTATCTTCTTGCCTC" +
			"GGTTCTCGTAACTTTCCGTTGATTTCCTCCACCTCAATTTCATGGCGTTGCAACAACCCTCTCTCTGCCAAACCCTCTTT" +
			"TGTTGTCAGAGCTGACTCCAATGTCGACGCTGCTTCCGACAATGCTGGTGAAGTTCCAGAAGCTGAAGGTAGCGTTGATC" +
			"AGGTTCCTGAAGATGGAGAAGCAGAACTAGCTTCGGATTCTGAGGTGGAGCAACCCAAGCCCCCTAGAAAGCAACGAGTC" +
			"AAGCTTGGAGATGTTATGGGGATATTGAATCAGAGGGCAATTGAGGCATCGGAAAGCATGAGGCCGACTCCAGAAATTAG" +
			"GACTGGAGATGTTGTGGAAATCAAACTGGAAGTTCCTGAGAACAAGCGTAGGTTGTCTATTTATAAAGGTATAGTCATCT" +
			"CAAGACAAAATGCTGGTATTCACACAACTATTCGAATCCGAAGGATTATTGCTGGCACAGGGGTTGAGATTGTCTTCCCA" +
			"ATTTACTCACCAAACATCAAAGAAATCAAAGTGGTAAACCACCGTAAAGTCAGAAGAGCAAGATTGTACTATTTAAGAGA" +
			"CAAGCTTCCCAGATTCTCCACTTTCAAATGATACGGTTACCACTTCTCATCCTGATCTTCTTCAAAGTAGTTGCTGATAT" +
			"TGCAGGGCCATATTTTGGTTATTTCGTTTTGTTGTGTTGTAGAATATATCATTTTTCTTCCTCTAAATCTATCCTCCGAG" +
			"AATTGGAAACAAGTGTATGTATGTTGCCCTTGATAATATTTGAAATTTGAAGTGTTCTCCCTTGCATTCCTTGGTATAGG" +
			"ATAGAAAGCCAAGCTCCTAAACAAACATTACTAAATATGACAGTCTAAGGAATGAGCATGTGTATCGATACCAGTTAAGT" +
			"GCATTGTGAATGTATTTTTTTTTTTTATCTCTATCCATAAAAAAAGGTATGTTCATTCTTG\n" +
			">TOG898302\n" +
			"AAGAAACAAGAGAGAGAAGATGATTTAGATGAGCCAAAAACAAAGGAAAAACGGCAAAAGGGAGAGAAAGGAAAATCTCC" +
			"ATCAGGTTTTCTTGCTCCTCTCCAGCTATCTGATGCCCTTGTAAACTTCCTTGGTACTGGAGAAAGTGAATTATCAAGAT" +
			"CTGATGTCATAAAAAGAATGTGGGAATACATAAAAGGAAACGACCTTCAGGATCCTTCTGACAAGAGGAAAATATTATGC" +
			"GACGACAAGCTGAAAGAACTCTTTGATGTGGACTCCTTTAACGGCTTCACCGTTACAAAACTGTTGACTCCTCATTTTAT" +
			"AAAGGCAGAGCAGTGAGTTGCTTGTGGAAATCGGTAATGTTGTCCAATTAGGTTTGGAAGGTCCTTCTTTTGTGGCCTTT" +
			"TGGCATTGTCTGCCAACACGAGGAATAGGAATTAGGAACATGACAGATTTTCAGTAAATTTTTCTCCAAGAATTTAATGT" +
			"TACGTGACCATTACTTTGTTTTTTTTAATATCACGTTTTGTCACTTGGCAGTTGAAATTTTTGTATATTTTCAGTTCCTG" +
			"AAGCTGCAAGGATAATGCTGACTTCTTACTCTACTCTGCATTTGCTCATATGAGGCACTACACATATCCATAATACATGA" +
			"ATAAATTTGCAGTATTGAA\n" +
			">TOG897516\n" +
			"CATTTGTTCCATTTGCTCAGGCATTTGCAGCTGTACTTACAGCTGTCCTTACTGGTTCTCTCTATTATGTGGCTGCCTCT" +
			"CCTAAAGATCCTACTTATATTGTGGCACCTGTTTTACAGTCTCGCTCTGGTCGTCAAGATTTGAAAAAGCTATTTGAAGC" +
			"CTGGTATGAGAAACGGCAAATGAAAAAAATATATTCACCACTTCTGGAAGGACTACTAGCTCTCTACCTAGGATTTGAGT" +
			"GGATCCAAACGAATAACATTCTTGCTCCCATTATCACACATGGCATATACTCCACAGTTATATTGGGACATGGCCTTTGG" +
			"AAGATAAACGACCACCGGCGAAGACTACGTCAAAGAATCCAACAGCTCAAATCTGAAGAACAAAATTCCCAGTAGACTTT" +
			"GAAATACCTTCCATGTCTGGCTGTGATACAAAAAATGTATATGTATGTATTAGAGCTGCTAATTATGTAAAGAGAAAAGA" +
			"TGTATATACTTGTGTTAGCTGAGGTCTCGTACACACTGAATATTCAGGTTTTGTTCACCATTTTCTAATTTCGAGTTACT" +
			"ATATGTAGTGTTTTCTAATAAAATGAAATAAAATCCCCAAGTTGGGTTGATTTAAATT\n" +
			">TOG894063\n" +
			"GAGACCTGTTATGATTCACAGAGCCATTCTAGGATCTGTTGAGCGCATGTTTGCCATTCTTTTAGAGCACTACAAGGGTA" +
			"AATGGCCCTTGTGGCTCAGTCCTCGTCAAGCAATTGTATGTCCTGTGTCAGAGAAATCACAAGCTTATGCACTGCAGGTG" +
			"CGAGATCAGATCCACCAAGCAGGATATCACGTTGATGCTGATACAACTGATCGGAAGATTCAGAAGAAGGTACGGGAAGC" +
			"TCAATTAGCGCAGTACAACTACATCTTGGTTGTTGGAGAGGAGGAAGCTAATACAGGACAGGTGAGTGTACGGGTTAGAG" +
			"ATAAAGCAGACCATAGCGTTATGAGTATTGAGAATCTACTCAAACACTTCAGCGACGAAGTTGCAGCTTTTCATTGATAC" +
			"TTCTCTTGTGAAAACTGTTGGAAGCAAATTTTACCCCCACTCACCTAGTTTGTTCACACTTTGTGTGCATTATTTATATT" +
			"TTCAGCCTGACAATTTACATTTAGATGATTTGGGTAATGACTGTATTTTCTATGTGAATTTTGGAGCGCACTGATATCGA" +
			"TCCATTGTTTGAAAAGCTGAGAGAAAGTGTAATCTTTTATTTTCTGTCTACATTTTAATTATGTTTTTCGTTAGTTTTTT" +
			"CCTTTTATATATTTGTTTGTTAAATTGAAGGAAACTATTGTTGG\n" +
			">TOG915900\n" +
			"GGAAATGAGCACAATGTTAAGCAGATCAAGAATTACCGCCAAAAGGTTGAGGAGGAACTCTCCAAAATTTGTGGTGACAT" +
			"CCTGACTATTATAGACCAGCATCTAATTCCTTCTTCCGCCTCAGCAGAAGCTAGTGTTTTCTACTATAAGATGAAAGGTG" +
			"ATTATTATCGGTATCTTGCTGAGTTCAAGACCGACCAAGAAAGGAAAGAGGCAGCCGAGCAGTCACTCAAGGGATATGAG" +
			"GCTGCTTCAGCCACTGCCAACACCGATCTTCCATCAACACATCCAATCCGTCTTGGACTTGCTCTCAACTTCTCTGTCTT" +
			"TTATTACGAGATCATGAACTCTCCTGAAAGGGCCTGCCATTTGGCTAAACAAGCTTTTGATGAGGCAATTGCAGAGTTGG" +
			"ACACCTTGAGTGAAGAGTCATACAAGGACAGTACTTTGATCATGCAGTTGTTGAGAGACAACCTGACTCTCTGGACATCC" +
			"GATTTGCCAGAAGATGGAGGCGAGGAGAACATAAAAGCTGAAGAAGCCAAACCTACTGAGCCTGAGAATTAACTAGGTTC" +
			"TTTTGGATCTTTGGCCCTGATTCAATAGTCAGATTTTTGTGGTGCTCTGCAAAGAGGGCATTTTTCAGCTTTTCTTGCAA" +
			"TGGATTTGGAATGGACAATATGAGCTGTCGCCACTTCATAATTACCAACCAAAGCCAAAAGATCTGAGCCTGCCTTTTCT" +
			"TTATTTCTTTAAATTGTTTTTCTTTCTTACTGCCTTTATCTATTTTAAGCAAAGTGGTCGGTTGAAACAATGGATAATTC" +
			"ACATTTAAATCATAAGAATCTTTTTCAAGTGTTCATTACATCCGTTTTGGTTCGTTTAAAATATTGTTTCCTATGCGCTC" +
			"CTAGATGGGATACAGTACAAGTATTCAACTGTTGAGCAGAGATTTTTACCTCAAAAAATTAGT\n" +
			">TOG895871\n" +
			"AGACACAACATCATAGAAACAGATCAACAACACATTAAAATTAGCATGGATCATAGCTTACGTTGTTTTGGGTCGACACT" +
			"ACCCAAAACTCTTCTTCAGTTTCTGTTATCACCTTCACTCCTTCTCTTCATCTCCTTCTTCAGTTTCTCCAACGCAGCCT" +
			"TCGACCTCGCCACCATACCCTTCAACGATGCCTATTCACCCCTCTTTGGGGATGGCAACCTTGTCCGCTCCGCCGATGGC" +
			"AACGGTGTTCAACTCCTCCTCGATCGCTTCACCGGTTCTGGTTTCGTTTCTTCCAATATGTACCAGCATGGATTCTTCAG" +
			"CGCCAATATCAAGCTACCATCGAATTACAGCGCTGGTATTTGCGTGGCCTTTTATACATCAAACAATGAGATGTTTGAGA" +
			"AGACACACGATGAGTTAGACTTTGAATTCTTAGGTAATATAGCCGGAAAGCCTTGGAGGTTTCAGACAAACTTGTACGGC" +
			"AATGGCAGCACCAACCGTGGCCGTGAGGAGCGGTACCGCCTCTGGTTTGATCCAACCAAGGGATTCCATAGATACAGCAT" +
			"TCTATGGACAGCTAAGAACATCATATTTTACATAGATGAGGTTCCAATTAGAGAAATTATAAGAAGTGAAGAAATGGGAG" +
			"CTGATTACCCAGCAAAGCCAATGGCATTATACGCCACAATATGGGATGCATCAAATTGGGCCACATCGGGTGGAAA",

  prot =">ADA84676.1 protein L-isoaspartyl methyltransferase 1 [Cicer arietinum]\n" +
			"MEQYWSGSAINENKGMVENLQRYGIIKSSKVAETMEKIDRGLFVPNGVQPYIDSPMSIGYNATISAPHMHATCLQLLE" +
			"NYLQPGMHALDVGSGTGYLTACFAMMVGPNGRAVGVEHIPELVSFSINNIEKSAAAPQLKDGSLSVHEGDGRQGWPEF" +
			"ATYDAIHVGAAAPEIPQPLIDQLKTGGRMIIPVGNVFQDLKVVDKNSDGSISIRTETSVRYVPLTSKEAQLKE\n" +
			">XP_002328850.1\n" +
			"MTISDEEDEILAKFLESEVLSEVSDQDQEEEETEEAKKEEDEPKFKRVRFQETQEEEKEQNQKKKANNNNNNKGEQRR" +
			"IKSGVLSKIPPELFPHILKFLSSEDLIACSLVCRFLNFAASDESLWRRLYCMRWGFLPPATKLCENAWKKLYIQRDEE" +
			"DMVKLVRNCPPEFKEYYVQMNAAKRSQTPLPSQVKDDRIILDKTIADQVSTWKSRRGLTDKVVTDHACSGETCSYFKL" +
			"GDVFVCEKTGNVHVCDDTCREVIMDPTNELLVCTISGHCFDRWLLPSEMEPDPDQQQGGLTDEAEPFMGSGRFARAYL" +
			"LGYNCDDDKELEAALRFC",

    mixed = cdna + "\n" + prot;

  // Helper to clear form after click event.
  function clearForm() {
    $('textarea').val('');
    $('input:text').val('');
    $('input:file').val('');
    $('input:checkbox').prop('checked', false);
    $('select').val('');

    $('.toggle').each(function() {
      $(this).hide();
    });

    $('form :input.auto-hint').autoHint('addHints');
  }

  clearForm();

  if (id === "cdna") {
    sequence.removeClass("auto-hint").val(cdna);

    blastn.prop("checked", true);
    $("#blastn").slideToggle();
    blastn_db.each(function() {
      $(this).attr("selected", "selected");
    });

    blastx.prop("checked", true);
    $("#blastx").slideToggle();
    blastx_db.each(function() {
      $(this).attr("selected", "selected");
    });
  } else if (id === "prot") {
    sequence.removeClass("auto-hint").val(prot);

    tblastn.prop("checked", true);
    $("#tblastn").slideToggle();
    tblastn_db.each(function() {
      $(this).attr("selected", "selected");
    });

    blastp.prop("checked", true);
    $("#blastp").slideToggle();
    blastp_db.each(function() {
      $(this).attr("selected", "selected");
    });
  } else if (id === "mixed") {
    sequence.removeClass("auto-hint").val(mixed);

    blastn.prop("checked", true);
    $("#blastn").slideToggle();
    blastn_db.each(function() {
      $(this).attr("selected", "selected");
    });

    blastx.prop("checked", true);
    $("#blastx").slideToggle();
    blastx_db.each(function() {
      $(this).attr("selected", "selected");
    });

    tblastn.prop("checked", true);
    $("#tblastn").slideToggle();
    tblastn_db.each(function() {
      $(this).attr("selected", "selected");
    });

    blastp.prop("checked", true);
    $("#blastp").slideToggle();
    blastp_db.each(function() {
      $(this).attr("selected", "selected");
    });
  }
};

$(function() {

  $("#example-sequences a").click(function() {
    var id = ($(this).attr("id"));
    SEQUENCES.addSequences(id);
  });

});