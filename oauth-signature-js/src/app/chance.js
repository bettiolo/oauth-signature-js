<script src="oauth-signature-js/src/app/oauth-signature.tests.js"></script>
<script src="oauth-signature-js/src/app/oauth-signature.js"></script>
<script>
    var mySeed;
    $.get("https://www.random.org/integers/", {num: "1", col: "1", min: "1", max: "1000000000", base: "10", format: "plain", rnd: "new"}, function(randNum) {
      mySeed = randNum;

      // Instantiate Chance with this truly random number as the seed
      var my_seeded_chance = new Chance(mySeed);
      console.log(my_seeded_chance.natural());
    });
</script>
