Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {
      Template.posts.helpers({
              posts: function() {
                        return Posts.find();
                            }
                       })
}


if (Meteor.isClient) {

  Template.buffer.output = function () {
    if (Session.get('output'))
      return Session.get('output');
    else
      return "please HACK ME ! \n- but be creative ! \n"
      +"\n"
      +"original project is(not mine):\n"
      +"Meteor Shell 0.0.1\n\n"
  }

  Template.input.events({

    'keypress input#cmd': function (evt) {
      if (evt.which === 13) { // enter key
        var cmd  = $('#cmd').val();
        console.log('exec: '+cmd );
       Posts.insert({name: cmd});

        Meteor.call('cmd', cmd, function (err, data) {
          $('#cmd').val('');
          Session.set('output', data );
        });
      }
    }

  });

  Template.analytics.rendered = function () { 
    if (!window._gaq) {
      window._gaq = [];
      
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-40601149-4', 'meteor.com');
      ga('send', 'pageview');
    }
};

} // end client

if (Meteor.isServer) {
  var posts=Posts.create
  var Future = Npm.require('fibers/future');

  Meteor.methods({

    cmd: function (command) {
      var explode = command.split(' ');
      var cmd = explode[0];
      var args = explode.splice(1, explode.length);
      console.log("e:"+cmd+JSON.stringify(args));

      var fut = new Future();

      var spawn = Npm.require('child_process').spawn;
      if (args.length == 0)
        ls    = spawn(cmd);
      else
        ls    = spawn(cmd , args);

      ls.stdout.on('data', function (data) {
        console.log(''+data);
        fut.ret(''+data);
      });

      ls.stderr.on('data', function (data) {
        console.log(''+data);
        fut.ret(''+data);
      });

      return fut.wait();
    }
  });
} // end server
