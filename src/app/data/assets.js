/*
 * The `assets` module
 * ============================================================================
 *
 * Use this module to declare static Phaser Asset Packs, that would be loaded
 * using the `Loader#pack` API.
 *
 * Regarding how the game assets should be declared using this file, refer to
 * the sample `assetPack.json` included in the Phaser package, under
 * `node_modules/phaser/resources/` directory, for a more complete
 * reference.
 *
 */


export default {

  // - Boot Assets ------------------------------------------------------------
  boot: [
    {
      key: 'splash-screen',
      type: 'image',
      url: 'img/splash-screen.png'
    },

    {
      key: 'progress-bar',
      type: 'image',
      url: 'img/progress-bar.png'
    }
  ],

  // - Game assets ------------------------------------------------------------
  game: [
    {
      key: 'phaser',
      type: 'image',
      url: 'img/phaser.png'
    },
    {
      key: 'program',
      type: 'text',
      url: 'text/program.asm',
      overwrite: false
    },
    {
      key: 'blocks',
      type: 'image',
      url: 'img/blocks.png'
    },
    {
      type: 'atlasJSONArray',
      key: 'pointers',
      textureURL: 'img/pointers.png',
      atlasURL: 'atlas/pointers.json',
      atlasData: null
    }

    // Example: adding a background music.
    // {
    //   key: 'tune',
    //   type: 'audio',
    //   urls: [ 'tune.oga', 'tune.m4a' ]
    // }

    // Example: adding a audio sprite containing sound effects.
    // {
    //   key: 'sfx',
    //   type: 'audiosprite',
    //   urls: [ 'sfx.m4a' ],
    //   jsonURL: 'sfx.json'
    // }
  ]

};
