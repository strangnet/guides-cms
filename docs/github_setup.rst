========================
Github Application Setup
========================

We make heavy use of the `Github API <https://developer.github.com>`_ since all
of the persistent storage is a Git repository.  So, you'll need to register
your own Github `OAuth <https://en.wikipedia.org/wiki/OAuth>`_ token to have the
CMS make requests to the Github API.  The following steps will walk you through
that setup process on github.com for an application running locally.

------------------------------
Create a repository for guides
------------------------------

First you'll need a new repository for all your content.  This can be an empty
repository at this point.

.. _github_registration:

--------------------------------
Registering a Github Application
--------------------------------

1. `Login to github.com <https://github.com/login>`_
2. Go to the `OAuth applications for developers section <https://github.com/settings/developers>`_ and click the register new application button
3. Set the Authorization callback URL to `http://127.0.0.1:5000/github/authorized`
    * You can also use `http://0.0.0.0:5000` if you're running locally with the
      `heroku local` command.
    * This is the URL Github will sent requests back to once a user has allowed
      your application to access their account.
4. You can fill out the other details as you see fit. The callback URL is the
   most important. Now click register.
5. Copy the Client ID and Client Secret on your newly created Github
   application. You'll need these to continue the :doc:`installation <install>`.
